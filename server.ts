import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// In-memory job state storage for long-running async tasks (like dashboard generation)
interface Job {
  status: "pending" | "completed" | "failed";
  data?: any;
  error?: string;
  createdAt: number;
}
const jobs = new Map<string, Job>();

// Automatically clean up jobs older than 15 minutes every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of jobs.entries()) {
    if (now - job.createdAt > 15 * 60 * 1000) {
      jobs.delete(id);
    }
  }
}, 5 * 60 * 1000);

app.use(express.json({ limit: '50mb' }));

// Initialize GoogleGenAI server-side with user key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to clean markdown json fences if model includes them
function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

// Helper to call generateContent with retry and fallback
async function generateContentWithRetryAndFallback(params: {
  model: string;
  contents: any;
  config?: any;
}, fallbackModels: string[] = [], maxRetries = 3, initialDelay = 1000): Promise<any> {
  const modelsToTry = [params.model, ...fallbackModels];
  
  for (let m = 0; m < modelsToTry.length; m++) {
    const currentModel = modelsToTry[m];
    let attempt = 0;
    
    while (true) {
      try {
        console.log(`[Gemini API] Attempting model ${currentModel} (attempt ${attempt + 1}/${maxRetries + 1})`);
        const response = await ai.models.generateContent({
          ...params,
          model: currentModel
        });
        return response;
      } catch (error: any) {
        attempt++;
        console.error(`[Gemini API] Attempt ${attempt} failed for model ${currentModel}:`, error);
        
        // Check if the error is a permanent quota limit zero (e.g. Free Tier with 0 quota)
        const isLimitZero = !!(
          error?.message?.includes("limit: 0") || 
          error?.message?.includes("Quota exceeded") && error?.message?.includes("limit: 0")
        );

        const isTransient = 
          !isLimitZero && (
            error?.status === "UNAVAILABLE" || 
            error?.status === "RESOURCE_EXHAUSTED" ||
            error?.code === 503 || 
            error?.code === 429 || 
            error?.statusCode === 503 || 
            error?.statusCode === 429 || 
            (error?.message && (
              error.message.includes("503") || 
              error.message.includes("429") || 
              error.message.includes("UNAVAILABLE") || 
              error.message.includes("RESOURCE_EXHAUSTED") || 
              error.message.includes("experiencing high demand") ||
              error.message.includes("overloaded") ||
              error.message.includes("Quota exceeded")
            ))
          );
          
        if (isTransient && attempt <= maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt - 1);
          console.log(`[Gemini API] Transient error detected. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        
        // If we have more models to try, break out of retry loop for this model and try next model
        if (m < modelsToTry.length - 1) {
          console.warn(`[Gemini API] Model ${currentModel} failed completely (isLimitZero: ${isLimitZero}). Falling back to ${modelsToTry[m + 1]}...`);
          break; // break the while(true) loop, moving to the next model in modelsToTry
        }
        
        // No more fallbacks, rethrow the error
        throw error;
      }
    }
  }
}

// Helper to format Gemini quota and limit errors nicely
function formatGeminiError(error: any): string {
  const msg = error?.message || "";
  console.error("[Gemini error detail]:", error);
  if (msg.includes("limit: 0") || msg.includes("Quota exceeded") || error?.status === "RESOURCE_EXHAUSTED" || error?.statusCode === 429 || error?.code === 429) {
    if (msg.includes("gemini-3.1-pro") || msg.includes("pro-preview")) {
      return "The 'gemini-3.1-pro-preview' model requires a paid Gemini API plan. Please configure a paid API key in Settings > Secrets or choose the free 'gemini-3.5-flash' model.";
    }
    if (msg.includes("lite-image") || msg.includes("flash-image") || msg.includes("image")) {
      return "UI mockup generation requires a paid Gemini API plan for image generation. Please configure a paid API key in Settings > Secrets or click to activate it.";
    }
    return "Gemini API Quota Exceeded. Please try again in a few seconds or check your Gemini API billing details.";
  }
  return error.message || "An unexpected error occurred.";
}

// 1. API Endpoint: Generate Blueprint
app.post("/api/generate-blueprint", async (req, res) => {
  try {
    const {
      idea,
      targetAudience = "General Users",
      platform = "Web",
      industry = "SaaS",
      designStyle = "Minimalist",
      brandColors = { primary: "#3b82f6", secondary: "#1e293b", hexCodes: ["#3b82f6", "#1e293b"] },
      aiModel = "gemini-3.5-flash"
    } = req.body;

    if (!idea || idea.trim().length === 0) {
      res.status(400).json({ error: "App idea is required" });
      return;
    }

    const selectedModel = "gemini-3.5-flash";

    console.log(`Generating blueprint using model ${selectedModel} for: ${idea}`);

    const prompt = `
Generate a complete, comprehensive, professional product blueprint and UX design document for the following app idea:
"${idea}"

User Specification Options:
- Target Audience: ${targetAudience}
- Platform Target: ${platform}
- Industry: ${industry}
- Preferred Design Style: ${designStyle}
- Brand Colors: Primary: ${brandColors.primary}, Secondary: ${brandColors.secondary}, Accent Hex Codes: ${brandColors.hexCodes.join(", ")}

You MUST return a JSON object that adheres strictly to the following structure. Do not wrap the JSON output with any comments, just return the raw JSON matching this TypeScript model:

{
  "productSummary": {
    "overview": "A concise 1-2 sentence overview of the application concept...",
    "problemStatement": "A 1-2 sentence articulation of the core problem this solves...",
    "targetUsers": ["User segment A", "User segment B"],
    "valueProposition": "A concise 1-2 sentence uniquely appealing aspect and benefit..."
  },
  "features": {
    "mustHave": ["Critical feature 1", "Critical feature 2"],
    "niceToHave": ["Useful secondary feature 1", "Useful secondary feature 2"],
    "futureFeatures": ["Exciting, long-term conceptual feature 1", "Exciting, long-term conceptual feature 2"]
  },
  "personas": [
    {
      "name": "Alex Mercer (Example)",
      "role": "Startup Owner (Example)",
      "goals": ["Key Goal 1", "Key Goal 2"],
      "painPoints": ["Key Pain point 1", "Key Pain point 2"],
      "techExp": "Intermediate...",
      "workflow": ["Step 1", "Step 2"]
    }
  ],
  "userJourney": {
    "steps": [
      {
        "step": 1,
        "stage": "Discovery",
        "action": "User opens the app...",
        "experience": "Subtle reaction...",
        "painPoint": "Potential friction..."
      }
    ]
  },
  "informationArchitecture": {
    "sections": [
      {
        "title": "Navigation Menu",
        "items": ["Dashboard", "Settings"]
      }
    ]
  },
  "screenList": [
    {
      "name": "Dashboard",
      "description": "Short 1-2 sentence description of the layout...",
      "keyComponents": ["Main Chart Widget", "KPI Cards"]
    }
  ],
  "dashboardSuggestions": {
    "layoutName": "Multi-Column Admin Panel",
    "elements": ["Sidebar links", "Global Search", "Quick-Action CTA"],
    "asciiWireframe": "Provide a simple and small ASCII art wireframe (under 10 lines) showing a visual layout of the dashboard.",
    "description": "Explain how the dashboard works in 1-2 sentences..."
  },
  "screenByScreenUI": [
    {
      "screenName": "Dashboard",
      "layout": "Grid-based modular system...",
      "components": ["KPI card", "D3 line chart"],
      "emptyState": "What is shown when there is no data in 1 sentence...",
      "errorState": "What is shown if data fails in 1 sentence...",
      "loadingState": "Skeleton loaders in 1 sentence..."
    }
  ],
  "designSystem": {
    "colors": [
      { "name": "Primary Accent", "value": "${brandColors.primary}", "use": "Primary CTAs, active states" },
      { "name": "Secondary Accent", "value": "${brandColors.secondary}", "use": "Supporting badges" }
    ],
    "typography": [
      { "element": "Display Headings", "font": "Inter / Space Grotesk", "size": "32px", "weight": "Bold" }
    ],
    "spacing": ["8px (sm)", "16px (md)", "24px (lg)"],
    "borderRadius": ["8px (md)", "12px (lg)"],
    "shadows": ["sm (subtle borders)", "md (floating components)"],
    "buttonStyles": "Brief instruction on hover effects and padding...",
    "formStyles": "Brief instruction on focus rings and input borders...",
    "cardStyles": "Brief instruction on borders and padding..."
  },
  "componentLibrary": [
    {
      "component": "Interactive Button",
      "recommendation": "Tailwind button with transition...",
      "implementationTips": "Add scale on press..."
    }
  ],
  "accessibilityAudit": {
    "contrast": "Brief 1-sentence color contrast guide...",
    "keyboard": "Brief 1-sentence tab/arrow keys navigation...",
    "screenReader": "Brief 1-sentence ARIA/semantic description...",
    "focusState": "Brief 1-sentence focus ring style...",
    "mobileUsability": "Brief 1-sentence tap target guideline..."
  },
  "responsiveDesign": {
    "mobile": "Single column layout...",
    "tablet": "Two-column grid layout...",
    "desktop": "Multi-column layout..."
  },
  "databaseSuggestions": {
    "entities": [
      {
        "name": "Users",
        "fields": [
          { "name": "id", "type": "UUID", "description": "Primary key" },
          { "name": "email", "type": "VARCHAR", "description": "Unique email" }
        ]
      }
    ],
    "relationships": ["Users can have multiple items (1-to-many)..."]
  },
  "apiSuggestions": [
    {
      "endpoint": "/api/v1/dashboard",
      "method": "GET",
      "description": "Fetch analytical data.",
      "requestBody": "None",
      "response": "{ \"kpi\": { ... } }"
    }
  ],
  "folderStructure": "Provide a simple project directory tree representation (ASCII or Markdown, max 10 lines) explaining where components belong.",
  "techStack": [
    { "category": "Frontend", "technology": "React (Vite) + TypeScript", "reason": "Fast development cycle." }
  ],
  "developmentRoadmap": [
    {
      "phase": "Phase 1: Foundation",
      "duration": "1 Week",
      "milestones": ["Set up project with TypeScript and Tailwind", "Create basic layout"]
    }
  ],
  "aiPrompts": {
    "gemini": "Prompt for Gemini...",
    "chatgpt": "Prompt for ChatGPT...",
    "cursor": "Prompt for Cursor...",
    "claude": "Prompt for Claude...",
    "bolt": "Prompt for Bolt...",
    "lovable": "Prompt for Lovable...",
    "v0": "Prompt for v0..."
  }
}

CRITICAL RULES:
1. Ground the design blueprint strictly in the design style: ${designStyle}, using brand colors: ${brandColors.hexCodes.join(", ")}.
2. Do not include any commentary before or after the JSON.
3. Keep the content clean, realistic, professional, and actionable.
4. COMPACT & ULTRA-CONCISE RESPONSE REQUIREMENT: To prevent serverless gateway timeouts, keep all description fields to exactly 1-2 sentences maximum, and limit all array inputs to exactly 1-2 items maximum. Keep the ASCII wireframe and folder structure small and under 10 lines.
    `;

    const fallbackModels = ["gemini-3.1-flash-lite"];

    const response = await generateContentWithRetryAndFallback({
      model: selectedModel,
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class Principal AI UX Designer and Digital Product Consultant. You analyze complex product requirements and produce robust, structured, pixel-perfect blueprints in JSON. Always return clean, well-formatted JSON.",
        responseMimeType: "application/json",
      }
    }, fallbackModels);

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response text received from Gemini API");
    }

    const cleanedJson = cleanJsonString(textOutput);
    const parsedData = JSON.parse(cleanedJson);

    res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating blueprint:", error);
    res.status(500).json({ error: formatGeminiError(error) });
  }
});

// 2. API Endpoint: Regenerate specific section
app.post("/api/regenerate-section", async (req, res) => {
  try {
    const {
      idea,
      designStyle,
      brandColors,
      sectionId,
      sectionName,
      customInstructions,
      currentSectionData
    } = req.body;

    if (!sectionId || !sectionName) {
      res.status(400).json({ error: "sectionId and sectionName are required" });
      return;
    }

    console.log(`Regenerating section: ${sectionName} (${sectionId}) with instructions: ${customInstructions}`);

    // If sectionId is dashboardSuggestions, we run as a background task to prevent Vercel serverless timeout
    if (sectionId === "dashboardSuggestions") {
      const jobId = `job_dash_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      jobs.set(jobId, { status: "pending", createdAt: Date.now() });

      // Trigger the asynchronous generation process
      (async () => {
        try {
          const detailPrompt = `
You are tasked with regenerating ONLY a specific section of a digital product blueprint.
The overall app is: "${idea}"
Preferred design style: ${designStyle}
Brand colors: Primary ${brandColors?.primary}, Secondary ${brandColors?.secondary}, Palette: ${brandColors?.hexCodes?.join(", ")}

The section you are regenerating is: "${sectionName}" (Identifier: ${sectionId})

Current data of this section:
${JSON.stringify(currentSectionData, null, 2)}

User's custom instructions/refinements for this section:
"${customInstructions || "Make it more thorough and include more edge cases."}"

Based on the above, rewrite and return ONLY the JSON representation of this specific section. The structure of this JSON MUST EXACTLY match the original schema/interface for "${sectionId}".

CRITICAL RULES:
1. Do not wrap the response with conversational text. Return only the clean raw JSON.
2. Provide an extremely detailed, rich, and thorough dashboard description with many visual components, key analytical widgets, responsive elements, and a high-fidelity ASCII wireframe showing the mock dashboard.
3. Do NOT make the response concise. Expand fully on user requirements.
`;

          let textOutput = "";
          let parsedData = null;
          let retryCount = 0;
          let currentPrompt = detailPrompt;

          while (retryCount <= 1) {
            try {
              console.log(`[Job ${jobId}] Calling Gemini API (attempt ${retryCount + 1})...`);
              const response = await generateContentWithRetryAndFallback({
                model: "gemini-3.5-flash",
                contents: currentPrompt,
                config: {
                  systemInstruction: "You are a Principal AI UX Designer. You refine product blueprint specifications incrementally based on user feedback. Always return clean JSON.",
                  responseMimeType: "application/json",
                  maxOutputTokens: 4000 // Specially increased max output tokens limit!
                }
              }, ["gemini-3.1-flash-lite"]);

              textOutput = response.text || "";
              if (!textOutput) {
                throw new Error("No response text received from Gemini API");
              }

              const cleanedJson = cleanJsonString(textOutput);
              parsedData = JSON.parse(cleanedJson);
              break; // Success!
            } catch (err: any) {
              console.warn(`[Job ${jobId}] Parsing failed on attempt ${retryCount + 1}:`, err.message);
              retryCount++;
              if (retryCount <= 1) {
                currentPrompt = `${detailPrompt}
                
IMPORTANT RETRY INSTRUCTION: The previous attempt failed because the returned JSON was malformed, incomplete, or truncated.
Please return ONLY the complete, syntactically correct, and valid JSON. Ensure that all brackets, braces, and strings are fully closed and valid. Do not cut off the response.`;
              } else {
                throw err;
              }
            }
          }

          jobs.set(jobId, {
            status: "completed",
            data: { sectionData: parsedData },
            createdAt: Date.now()
          });
          console.log(`[Job ${jobId}] Completed successfully.`);
        } catch (err: any) {
          console.error(`[Job ${jobId}] Failed:`, err);
          jobs.set(jobId, {
            status: "failed",
            error: formatGeminiError(err),
            createdAt: Date.now()
          });
        }
      })();

      res.json({ jobId, status: "pending" });
      return;
    }

    // Default synchronous flow with JSON validation retry logic for other sections
    const prompt = `
You are tasked with regenerating ONLY a specific section of a digital product blueprint.
The overall app is: "${idea}"
Preferred design style: ${designStyle}
Brand colors: Primary ${brandColors?.primary}, Secondary ${brandColors?.secondary}, Palette: ${brandColors?.hexCodes?.join(", ")}

The section you are regenerating is: "${sectionName}" (Identifier: ${sectionId})

Current data of this section:
${JSON.stringify(currentSectionData, null, 2)}

User's custom instructions/refinements for this section:
"${customInstructions || "Make it more thorough and include more edge cases."}"

Based on the above, rewrite and return ONLY the JSON representation of this specific section. The structure of this JSON MUST EXACTLY match the original schema/interface for "${sectionId}".
For example, if regenerating "personas", return a JSON Array of Personas. If regenerating "databaseSuggestions", return a JSON Object with keys "entities" and "relationships".

CRITICAL RULES:
1. Do not wrap the response with conversational text. Return only the clean raw JSON.
2. Keep the response extremely concise (under 2 sentences per description/field, and limit arrays to 2-3 items unless specifically requested otherwise) to ensure lightning-fast API responses and avoid serverless hosting timeouts.
`;

    let textOutput = "";
    let parsedData = null;
    let retryCount = 0;
    let currentPrompt = prompt;

    while (retryCount <= 1) {
      try {
        const response = await generateContentWithRetryAndFallback({
          model: "gemini-3.5-flash",
          contents: currentPrompt,
          config: {
            systemInstruction: "You are a Principal AI UX Designer. You refine product blueprint specifications incrementally based on user feedback. Always return clean JSON.",
            responseMimeType: "application/json",
          }
        }, ["gemini-3.1-flash-lite"]);

        textOutput = response.text || "";
        if (!textOutput) {
          throw new Error("No response text received from Gemini API");
        }

        const cleanedJson = cleanJsonString(textOutput);
        parsedData = JSON.parse(cleanedJson);
        break;
      } catch (err: any) {
        console.warn(`Parsing failed for section ${sectionId} on attempt ${retryCount + 1}:`, err.message);
        retryCount++;
        if (retryCount <= 1) {
          currentPrompt = `${prompt}
          
IMPORTANT RETRY INSTRUCTION: The previous attempt failed because the returned JSON was malformed or incomplete.
Please return ONLY complete, valid, syntactically correct JSON that matches the required schema perfectly.`;
        } else {
          throw err;
        }
      }
    }

    res.json({ sectionData: parsedData });
  } catch (error: any) {
    console.error("Error regenerating section:", error);
    res.status(500).json({ error: formatGeminiError(error) });
  }
});

// 2b. API Endpoint: Check background job status
app.get("/api/job-status/:jobId", (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  if (!job) {
    res.status(404).json({ error: "Job not found or expired" });
    return;
  }
  res.json(job);
});

// 3. API Endpoint: Generate UI Mockup Image using Nano Banana
app.post("/api/generate-mockup", async (req, res) => {
  try {
    const {
      idea,
      designStyle = "Minimalist",
      brandColors = { primary: "#3b82f6", secondary: "#1e293b" },
      screenType = "Dashboard"
    } = req.body;

    if (!idea) {
      res.status(400).json({ error: "App idea/description is required" });
      return;
    }

    // Adjust Aspect Ratio based on mock type
    let aspectRatio = "16:9";
    if (screenType === "Mobile screens") {
      aspectRatio = "9:16";
    }

    const imagePrompt = `A high-fidelity digital product design UI mockup of a ${screenType} for: "${idea}". 
The UI features a gorgeous, professional ${designStyle} design style. 
Utilizes a unified clean dark glassmorphism theme, styled with brand colors of ${brandColors.primary} and ${brandColors.secondary}. 
Extremely clean layout, sharp elements, stunning typography, dashboard widgets, vector charts, landing columns, pixel-perfect digital UI concept. 
Clean corporate presentation. Do NOT include any physical device mockups (like laptop frames, phone bodies, hands). 
No physical elements, no people. Pristine digital asset.`;

    console.log(`Generating mockup image of type: ${screenType} with aspect ratio ${aspectRatio}`);

    const response = await generateContentWithRetryAndFallback({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: imagePrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any
        }
      }
    }, ['gemini-3.1-flash-image']);

    let base64Image = "";
    
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("No inline image data returned by the image generation model");
    }

    res.json({ imageUrl: `data:image/png;base64,${base64Image}`, prompt: imagePrompt });
  } catch (error: any) {
    console.error("Error generating mockup:", error);
    res.status(500).json({ error: formatGeminiError(error) });
  }
});

// Configure Vite and static assets serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    // Vite dev server integration
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve built static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI UX Designer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
