import React, { useState } from "react";
import { 
  Sparkles, Download, Copy, Check, Info, Layout, Layers, User, Map, Database, 
  Terminal, ShieldAlert, Cpu, RefreshCw, Star, Code, Accessibility, Eye
} from "lucide-react";
import { Blueprint, MockupItem } from "../types";
import InteractiveDesignSystem from "./InteractiveDesignSystem";

interface BlueprintViewProps {
  blueprint: Blueprint;
  onUpdateBlueprint: (updated: Blueprint) => void;
}

type TabCategory = "blueprint" | "ux" | "ui" | "design" | "engineering" | "tech" | "mockups";

const LOADING_MESSAGES = [
  "Initializing Nano Banana visual engine...",
  "Applying preferred layout structures...",
  "Baking brand color colorways...",
  "Synthesizing high-contrast UI components...",
  "Polishing glassmorphic layout details...",
  "Finalizing high-fidelity pixel-perfect render..."
];

export default function BlueprintView({ blueprint, onUpdateBlueprint }: BlueprintViewProps) {
  const [activeCategory, setActiveCategory] = useState<TabCategory>("blueprint");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Regeneration state
  const [regeneratingSectionId, setRegeneratingSectionId] = useState<string | null>(null);
  const [refineInstructions, setRefineInstructions] = useState("");
  const [isRegeneratingSection, setIsRegeneratingSection] = useState(false);

  // Mockup generation state
  const [generatingMockupType, setGeneratingMockupType] = useState<string | null>(null);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Export functions
  const exportAsMarkdown = () => {
    let md = `# AI UX Product Blueprint: ${blueprint.idea}\n\n`;
    md += `**Industry:** ${blueprint.industry} | **Platform:** ${blueprint.platform} | **Design Style:** ${blueprint.designStyle}\n`;
    md += `**Brand Colors:** Primary: ${blueprint.brandColors.primary}, Secondary: ${blueprint.brandColors.secondary}\n\n`;
    
    md += `## 1. Product Summary\n`;
    md += `### Overview\n${blueprint.productSummary.overview}\n\n`;
    md += `### Problem Statement\n${blueprint.productSummary.problemStatement}\n\n`;
    md += `### Core Value Proposition\n${blueprint.productSummary.valueProposition}\n\n`;
    
    md += `## 2. Feature List\n`;
    md += `### Must-Have\n` + blueprint.features.mustHave.map(f => `- ${f}`).join("\n") + "\n\n";
    md += `### Nice-to-Have\n` + blueprint.features.niceToHave.map(f => `- ${f}`).join("\n") + "\n\n";
    md += `### Future Features\n` + blueprint.features.futureFeatures.map(f => `- ${f}`).join("\n") + "\n\n";

    md += `## 3. User Personas\n`;
    blueprint.personas.forEach(p => {
      md += `### Persona: ${p.name} (${p.role})\n`;
      md += `- **Technical Experience:** ${p.techExp}\n`;
      md += `- **Goals:**\n` + p.goals.map(g => `  - ${g}`).join("\n") + "\n";
      md += `- **Pain Points:**\n` + p.painPoints.map(g => `  - ${g}`).join("\n") + "\n";
      md += `- **Typical Workflow:**\n` + p.workflow.map(g => `  - ${g}`).join("\n") + "\n\n";
    });

    md += `## 4. User Journey\n`;
    blueprint.userJourney.steps.forEach(s => {
      md += `### Step ${s.step}: ${s.stage}\n`;
      md += `- **User Action:** ${s.action}\n`;
      md += `- **Interface Experience:** ${s.experience}\n`;
      md += `- **Potential Pain Point:** ${s.painPoint}\n\n`;
    });

    md += `## 5. Screen List & UI Flow\n`;
    blueprint.screenList.forEach(s => {
      md += `### Screen: ${s.name}\n`;
      md += `- **Description:** ${s.description}\n`;
      md += `- **Key Components:** ${s.keyComponents.join(", ")}\n\n`;
    });

    md += `## 6. Dashboard ASCII Wireframe\n`;
    md += `\`\`\`\n${blueprint.dashboardSuggestions.asciiWireframe}\n\`\`\`\n\n`;
    md += `${blueprint.dashboardSuggestions.description}\n\n`;

    md += `## 7. Database Entity Schema\n`;
    blueprint.databaseSuggestions.entities.forEach(e => {
      md += `### Table: ${e.name}\n`;
      e.fields.forEach(f => {
        md += `- \`${f.name}\` (${f.type}): ${f.description}\n`;
      });
      md += "\n";
    });
    md += `### Relationships\n` + blueprint.databaseSuggestions.relationships.map(r => `- ${r}`).join("\n") + "\n\n";

    md += `## 8. REST API Endpoints\n`;
    blueprint.apiSuggestions.forEach(api => {
      md += `### \`${api.method}\` ${api.endpoint}\n`;
      md += `- **Description:** ${api.description}\n`;
      if (api.requestBody) md += `- **Request Body:** \`${api.requestBody}\`\n`;
      if (api.response) md += `- **Response:** \`${api.response}\`\n`;
      md += "\n";
    });

    md += `## 9. Folder Directory Structure\n`;
    md += `\`\`\`\n${blueprint.folderStructure}\n\`\`\`\n\n`;

    md += `## 10. Recommended Tech Stack\n`;
    blueprint.techStack.forEach(t => {
      md += `- **${t.category}:** ${t.technology} (Reason: ${t.reason})\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `blueprint_${blueprint.id.substring(0, 5)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsJSON = () => {
    const jsonStr = JSON.stringify(blueprint, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `blueprint_${blueprint.id.substring(0, 5)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPDFPrint = () => {
    window.print();
  };

  // Section level regeneration handler
  const handleRegenerateSection = async (sectionId: string, sectionName: string) => {
    try {
      setIsRegeneratingSection(true);
      let currentSectionData: any = {};
      
      // Map sectionId to correct property
      if (sectionId === "productSummary") currentSectionData = blueprint.productSummary;
      else if (sectionId === "features") currentSectionData = blueprint.features;
      else if (sectionId === "personas") currentSectionData = blueprint.personas;
      else if (sectionId === "userJourney") currentSectionData = blueprint.userJourney;
      else if (sectionId === "informationArchitecture") currentSectionData = blueprint.informationArchitecture;
      else if (sectionId === "screenList") currentSectionData = blueprint.screenList;
      else if (sectionId === "dashboardSuggestions") currentSectionData = blueprint.dashboardSuggestions;
      else if (sectionId === "screenByScreenUI") currentSectionData = blueprint.screenByScreenUI;
      else if (sectionId === "designSystem") currentSectionData = blueprint.designSystem;
      else if (sectionId === "componentLibrary") currentSectionData = blueprint.componentLibrary;
      else if (sectionId === "accessibilityAudit") currentSectionData = blueprint.accessibilityAudit;
      else if (sectionId === "responsiveDesign") currentSectionData = blueprint.responsiveDesign;
      else if (sectionId === "databaseSuggestions") currentSectionData = blueprint.databaseSuggestions;
      else if (sectionId === "apiSuggestions") currentSectionData = blueprint.apiSuggestions;
      else if (sectionId === "folderStructure") currentSectionData = blueprint.folderStructure;
      else if (sectionId === "techStack") currentSectionData = blueprint.techStack;
      else if (sectionId === "developmentRoadmap") currentSectionData = blueprint.developmentRoadmap;
      else if (sectionId === "aiPrompts") currentSectionData = blueprint.aiPrompts;

      const res = await fetch("/api/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: blueprint.idea,
          designStyle: blueprint.designStyle,
          brandColors: blueprint.brandColors,
          sectionId,
          sectionName,
          customInstructions: refineInstructions,
          currentSectionData
        })
      });

      if (!res.ok) {
        let errorMsg = "Failed to regenerate section";
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await res.json();
            errorMsg = errorData.error || errorMsg;
          } catch (e) {
            // ignore
          }
        } else {
          const text = await res.text();
          if (text.length > 0) {
            errorMsg = text.length > 200 ? `${text.substring(0, 200)}...` : text;
          }
        }
        throw new Error(errorMsg);
      }

      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error("Invalid response received from server.");
      }
      
      // If background job is started, poll for completion
      if (data && data.jobId) {
        const jobId = data.jobId;
        let jobStatus = data.status;
        let finalData = null;
        
        while (jobStatus === "pending") {
          // Wait for 1.5 seconds between polls
          await new Promise((resolve) => setTimeout(resolve, 1500));
          
          const pollRes = await fetch(`/api/job-status/${jobId}`);
          if (!pollRes.ok) {
            throw new Error("Failed to get background job status");
          }
          
          const pollData = await pollRes.json();
          jobStatus = pollData.status;
          
          if (jobStatus === "completed") {
            finalData = pollData.data;
          } else if (jobStatus === "failed") {
            throw new Error(pollData.error || "Background generation failed");
          }
        }
        
        data = finalData;
      }
      
      // Update blueprint clone
      const cloned = { ...blueprint };
      (cloned as any)[sectionId] = data.sectionData;

      onUpdateBlueprint(cloned);
      setRegeneratingSectionId(null);
      setRefineInstructions("");
    } catch (err: any) {
      alert(`Regeneration failed: ${err.message}`);
    } finally {
      setIsRegeneratingSection(false);
    }
  };

  // Generate mockup using Nano Banana
  const handleGenerateMockup = async (screenType: 'Dashboard' | 'Login page' | 'Mobile screens' | 'Landing page' | 'Analytics page') => {
    try {
      setGeneratingMockupType(screenType);
      
      // Cycle through messages while waiting
      let idx = 0;
      setLoadingMessageIdx(idx);
      const interval = setInterval(() => {
        idx = (idx + 1) % LOADING_MESSAGES.length;
        setLoadingMessageIdx(idx);
      }, 3500);

      const res = await fetch("/api/generate-mockup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: blueprint.idea,
          designStyle: blueprint.designStyle,
          brandColors: blueprint.brandColors,
          screenType
        })
      });

      clearInterval(interval);

      if (!res.ok) {
        let errorMsg = "Mockup image model error";
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await res.json();
            errorMsg = errorData.error || errorMsg;
          } catch (e) {
            // ignore
          }
        } else {
          const text = await res.text();
          if (text.length > 0) {
            errorMsg = text.length > 200 ? `${text.substring(0, 200)}...` : text;
          }
        }
        throw new Error(errorMsg);
      }

      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error("Invalid mockup data received from server.");
      }
      
      // Append to mockups list
      const currentMockups = blueprint.mockups ? [...blueprint.mockups] : [];
      const updatedMockups = currentMockups.filter(m => m.type !== screenType);
      updatedMockups.push({
        type: screenType,
        imageUrl: data.imageUrl,
        prompt: data.prompt
      });

      onUpdateBlueprint({
        ...blueprint,
        mockups: updatedMockups
      });

    } catch (err: any) {
      alert(`Mockup generation failed: ${err.message}`);
    } finally {
      setGeneratingMockupType(null);
    }
  };

  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}?id=${blueprint.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedText("share-link");
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getMockupForType = (type: string): MockupItem | undefined => {
    return blueprint.mockups?.find(m => m.type === type);
  };

  return (
    <div id="blueprint-viewer" className="flex-1 flex flex-col md:flex-row overflow-hidden h-full bg-transparent relative z-10">
      
      {/* Blueprint Sub-navigation categories (Left of viewport) */}
      <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/5 bg-black/15 backdrop-blur-md flex flex-col p-4 gap-1 overflow-y-auto">
        <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider px-3 mb-2 block">
          Blueprint Directory
        </span>
        {[
          { id: "blueprint", name: "Product Specs", icon: Info },
          { id: "ux", name: "UX Persona & IA", icon: User },
          { id: "ui", name: "UI Architecture", icon: Layout },
          { id: "design", name: "Design System", icon: Layers },
          { id: "engineering", name: "System Eng", icon: Database },
          { id: "tech", name: "Tech & Plan", icon: Terminal },
          { id: "mockups", name: "Prompts & Mockups", icon: Sparkles }
        ].map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                setRegeneratingSectionId(null);
              }}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-white/10 border-l-2 border-blue-400 text-blue-400 font-extrabold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {cat.name}
            </button>
          );
        })}

        {/* Brand color preview strip */}
        <div className="mt-8 p-3.5 rounded-2xl border border-white/5 bg-white/5 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Color Palette</span>
          <div className="flex gap-1.5">
            {blueprint.brandColors.hexCodes.slice(0, 4).map((c, i) => (
              <span 
                key={i} 
                className="w-5 h-5 rounded-full border border-white/10 shadow-sm block" 
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-500 block font-mono">Style: {blueprint.designStyle}</span>
        </div>
      </div>

      {/* Main workspace container */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        
        {/* Workspace Toolbar */}
        <div className="p-4 border-b border-white/5 bg-black/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-md font-bold text-slate-200 line-clamp-1 leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Workspace: {blueprint.idea}
            </h2>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-medium">
              <span>{blueprint.industry}</span>
              <span>•</span>
              <span>{blueprint.platform}</span>
              <span>•</span>
              <span>Style: {blueprint.designStyle}</span>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-full border border-white/10 font-bold transition-all cursor-pointer"
              title="Copy shareable deep link"
            >
              {copiedText === "share-link" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Share Link
                </>
              )}
            </button>
            <button
              onClick={exportAsMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-full border border-white/10 font-bold transition-all cursor-pointer"
              title="Download Markdown documentation"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              Markdown
            </button>
            <button
              onClick={exportAsJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-full border border-white/10 font-bold transition-all cursor-pointer"
              title="Download blueprint JSON dataset"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              JSON
            </button>
            <button
              onClick={triggerPDFPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-xs text-blue-400 rounded-full border border-blue-500/20 font-bold transition-all cursor-pointer"
              title="Trigger browser print to save as PDF"
            >
              <Eye className="w-3.5 h-3.5" />
              PDF / Print
            </button>
          </div>
        </div>

        {/* Content Viewer viewport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 print:p-0">
          
          {/* Section Refinement Backdrop Overlay (inline placeholder) */}
          {regeneratingSectionId && (
            <div className="p-5 rounded-2xl border border-indigo-900/40 bg-indigo-950/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Regenerating section: {blueprint[regeneratingSectionId as keyof Blueprint] ? (blueprint as any)[regeneratingSectionId].title || regeneratingSectionId : regeneratingSectionId}
              </div>
              <p className="text-xs text-slate-400">
                Specify what you want to change, add, or delete from this specific blueprint section. The AI will rebuild only this component:
              </p>
              <textarea
                rows={3}
                value={refineInstructions}
                onChange={(e) => setRefineInstructions(e.target.value)}
                placeholder="e.g. 'Add detailed fields for invoice tracking, including VAT, dynamic currency options, and billing address validation...'"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  onClick={() => {
                    setRegeneratingSectionId(null);
                    setRefineInstructions("");
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  disabled={isRegeneratingSection || !refineInstructions.trim()}
                  onClick={() => handleRegenerateSection(regeneratingSectionId, regeneratingSectionId)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-50"
                >
                  {isRegeneratingSection ? "Refining..." : "Rebuild Section"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: Product Specs */}
          {activeCategory === "blueprint" && (
            <div className="space-y-6">
              
              {/* Product Summary section */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("productSummary")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Summary
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">1. Product Summary</span>
                <h3 className="text-lg font-bold text-white mt-1">Application Architecture & Scope</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept Overview</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {blueprint.productSummary.overview}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Problem Statement</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {blueprint.productSummary.problemStatement}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target User Segments</h4>
                    <ul className="space-y-1">
                      {blueprint.productSummary.targetUsers.map((user, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {user}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Value Proposition</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {blueprint.productSummary.valueProposition}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature List section */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("features")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Features
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">2. Feature Matrix</span>
                <h3 className="text-lg font-bold text-white mt-1">Product Feature Map</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <span className="px-2.5 py-1 text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-400 uppercase">Must-Have (MVP)</span>
                    <ul className="space-y-2">
                      {blueprint.features.mustHave.map((f, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <span className="px-2.5 py-1 text-[9px] font-bold bg-blue-500/10 border border-blue-500/25 rounded-full text-blue-400 uppercase">Nice-to-Have</span>
                    <ul className="space-y-2">
                      {blueprint.features.niceToHave.map((f, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <span className="px-2.5 py-1 text-[9px] font-bold bg-purple-500/10 border border-purple-500/25 rounded-full text-purple-400 uppercase">Future Features</span>
                    <ul className="space-y-2">
                      {blueprint.features.futureFeatures.map((f, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">✦</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: UX Persona & IA */}
          {activeCategory === "ux" && (
            <div className="space-y-6">
              
              {/* Personas section */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("personas")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Personas
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">3. Target Personas</span>
                <h3 className="text-lg font-bold text-white mt-1">User Profiles & Objectives</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {blueprint.personas.map((persona, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-md font-bold text-white">{persona.name}</h4>
                          <span className="text-xs text-blue-400 font-mono">{persona.role}</span>
                        </div>
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-black/30 border border-white/10 rounded text-slate-400 font-mono">
                          Tech: {persona.techExp}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Goals & Needs</span>
                          <ul className="space-y-1 mt-1">
                            {persona.goals.map((g, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                {g}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pain Points</span>
                          <ul className="space-y-1 mt-1">
                            {persona.painPoints.map((p, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-rose-500" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-white/5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Daily Workflow Loop</span>
                          <ol className="space-y-1 mt-1 text-xs text-slate-400">
                            {persona.workflow.map((w, i) => (
                              <li key={i} className="flex gap-1.5">
                                <span className="font-mono text-[10px] text-blue-500">{i + 1}.</span>
                                {w}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Journey section */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("userJourney")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Journey
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">4. User Journey Map</span>
                <h3 className="text-lg font-bold text-white mt-1">Lifecycle Action Steps</h3>
                
                <div className="space-y-3 pt-2">
                  {blueprint.userJourney.steps.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-blue-950/40 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                          {step.step}
                        </span>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Stage</span>
                          <span className="text-xs font-bold text-white">{step.stage}</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">User Action</span>
                        <p className="text-xs text-slate-300">{step.action}</p>
                      </div>

                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Experience</span>
                        <p className="text-xs text-slate-300">{step.experience}</p>
                      </div>

                      <div className="flex-1 space-y-1 bg-rose-950/20 border border-rose-950/40 p-2.5 rounded-lg">
                        <span className="text-[10px] uppercase font-bold text-rose-400 block">Friction / Pain Point</span>
                        <p className="text-xs text-slate-400">{step.painPoint}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: UI Architecture */}
          {activeCategory === "ui" && (
            <div className="space-y-6">
              
              {/* IA Navigation section */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("informationArchitecture")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate IA
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">5. Information Architecture</span>
                <h3 className="text-lg font-bold text-white mt-1">Global Navigation & Structure</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {blueprint.informationArchitecture.sections.map((sec, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">{sec.title}</h4>
                      <ul className="space-y-1.5">
                        {sec.items.map((item, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-black/40 rounded border border-blue-500/50" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dashboard Suggestions (ASCII Wireframes) */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("dashboardSuggestions")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Wireframe
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">6. Dashboard Wireframe Suggestions</span>
                <h3 className="text-lg font-bold text-white mt-1">{blueprint.dashboardSuggestions.layoutName}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {blueprint.dashboardSuggestions.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Wireframe Elements</span>
                  <div className="flex flex-wrap gap-1.5">
                    {blueprint.dashboardSuggestions.elements.map((el, i) => (
                      <span key={i} className="bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-xs text-slate-300">
                        {el}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ASCII Art Component Wireframe</span>
                  <pre className="font-mono text-[10px] sm:text-xs bg-black/30 p-5 rounded-2xl border border-white/10 text-blue-400 overflow-x-auto leading-relaxed font-bold">
                    {blueprint.dashboardSuggestions.asciiWireframe}
                  </pre>
                </div>
              </div>

              {/* Screen List Suggestions */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("screenList")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Screens
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">7. Screen List Blueprint</span>
                <h3 className="text-lg font-bold text-white mt-1">Application Views & Interface Layout</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {blueprint.screenList.map((screen, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">{screen.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{screen.description}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Core View Components</span>
                        <div className="flex flex-wrap gap-1">
                          {screen.keyComponents.map((comp, i) => (
                            <span key={i} className="bg-white/5 text-blue-300 px-2 py-0.5 rounded-full text-[9px] font-mono border border-white/10">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screen by Screen UI States */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("screenByScreenUI")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate States
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">8. Screen-by-Screen UI States</span>
                <h3 className="text-lg font-bold text-white mt-1">Dynamic View Configurations</h3>
                
                <div className="space-y-4 pt-2">
                  {blueprint.screenByScreenUI.slice(0, 3).map((state, idx) => (
                    <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">Screen: {state.screenName}</h4>
                        <p className="text-xs text-slate-400 mt-0.5"><strong className="text-slate-300">Layout System:</strong> {state.layout}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="p-3 rounded-xl border border-white/5 bg-white/5">
                          <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider block">Empty State</span>
                          <p className="text-xs text-slate-400 mt-1 leading-normal">{state.emptyState}</p>
                        </div>
                        <div className="p-3 rounded-xl border border-rose-950/40 bg-rose-950/5">
                          <span className="text-[9px] font-bold uppercase text-rose-400 tracking-wider block">Error State</span>
                          <p className="text-xs text-slate-400 mt-1 leading-normal">{state.errorState}</p>
                        </div>
                        <div className="p-3 rounded-xl border border-blue-950 bg-blue-950/10">
                          <span className="text-[9px] font-bold uppercase text-blue-400 tracking-wider block">Loading State</span>
                          <p className="text-xs text-slate-400 mt-1 leading-normal">{state.loadingState}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Design System */}
          {activeCategory === "design" && (
            <div className="space-y-6">
              
              {/* Interactive Design System mount */}
              <div className="relative">
                <div className="absolute top-6 right-6 z-10">
                  <button 
                    onClick={() => setRegeneratingSectionId("designSystem")}
                    className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate System
                  </button>
                </div>

                <InteractiveDesignSystem 
                  designSystem={blueprint.designSystem}
                  styleName={blueprint.designStyle}
                  primaryColor={blueprint.brandColors.primary}
                  secondaryColor={blueprint.brandColors.secondary}
                />
              </div>

            </div>
          )}

          {/* TAB 5: System Engineering */}
          {activeCategory === "engineering" && (
            <div className="space-y-6">
              
              {/* Component Library recommendations */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("componentLibrary")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Components
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">9. Reusable Component Library</span>
                <h3 className="text-lg font-bold text-white mt-1">Recommended System Primitives</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {blueprint.componentLibrary.map((comp, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-blue-400" />
                        {comp.component}
                      </span>
                      <p className="text-xs text-slate-300 leading-normal">{comp.recommendation}</p>
                      <div className="pt-2 border-t border-white/5 text-[10px] text-slate-500 leading-normal">
                        <strong className="text-slate-400">Implementation:</strong> {comp.implementationTips}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Database suggestions */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("databaseSuggestions")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Database
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">10. Database Schema recommendations</span>
                <h3 className="text-lg font-bold text-white mt-1">Data Entity Structure</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {blueprint.databaseSuggestions.entities.map((entity, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-white font-mono flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-blue-400" />
                        {entity.name}
                      </span>
                      <div className="divide-y divide-white/5">
                        {entity.fields.map((f, i) => (
                          <div key={i} className="py-1.5 flex justify-between items-start gap-4">
                            <div>
                              <span className="text-xs font-bold text-slate-300 font-mono">{f.name}</span>
                              <span className="text-[10px] text-slate-500 block">{f.description}</span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/40 border border-white/10 text-slate-400 uppercase font-semibold">
                              {f.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Relational Mappings</span>
                  <ul className="space-y-1 mt-1.5">
                    {blueprint.databaseSuggestions.relationships.map((rel, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {rel}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* REST API Suggestions */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("apiSuggestions")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate APIs
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">11. REST API suggestions</span>
                <h3 className="text-lg font-bold text-white mt-1">Backend Routing Endpoints</h3>
                
                <div className="space-y-3 pt-2">
                  {blueprint.apiSuggestions.map((api, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold font-mono uppercase ${
                          api.method === "GET" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          api.method === "POST" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                          "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {api.method}
                        </span>
                        <span className="text-xs font-bold text-white font-mono">{api.endpoint}</span>
                      </div>
                      
                      <p className="text-xs text-slate-400 leading-normal">{api.description}</p>

                      {api.requestBody && api.requestBody !== "None" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Request Schema</span>
                            <pre className="font-mono text-[10px] bg-black/30 p-2.5 rounded border border-white/5 text-slate-300 overflow-x-auto">
                              {api.requestBody}
                            </pre>
                          </div>
                          {api.response && (
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Response Format</span>
                              <pre className="font-mono text-[10px] bg-black/30 p-2.5 rounded border border-white/5 text-slate-300 overflow-x-auto">
                                {api.response}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Folder directory structure */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("folderStructure")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Folders
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">12. Folder Directory Structure</span>
                <h3 className="text-lg font-bold text-white mt-1">Recommended Scalable File Layout</h3>
                <pre className="font-mono text-xs bg-black/30 p-5 rounded-2xl border border-white/10 text-blue-400 overflow-x-auto leading-relaxed">
                  {blueprint.folderStructure}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 6: Tech & Plan */}
          {activeCategory === "tech" && (
            <div className="space-y-6">
              
              {/* Tech Stack selection */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("techStack")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Stack
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">13. Technology Stack Suggestions</span>
                <h3 className="text-lg font-bold text-white mt-1">Strategic Framework Selection</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {blueprint.techStack.map((tech, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">{tech.category}</span>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        {tech.technology}
                      </h4>
                      <p className="text-xs text-slate-400 leading-normal pt-1.5 border-t border-white/5">{tech.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dev roadmap */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("developmentRoadmap")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Roadmap
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">14. Development Roadmap</span>
                <h3 className="text-lg font-bold text-white mt-1">Milestone Execution Strategy</h3>
                
                <div className="space-y-4 pt-2">
                  {blueprint.developmentRoadmap.map((phase, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">{phase.phase}</h4>
                        <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-black/40 border border-white/10 rounded text-slate-400">
                          Duration: {phase.duration}
                        </span>
                      </div>
                      <ul className="space-y-1.5 pt-1">
                        {phase.milestones.map((ms, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                            <span className="text-blue-500">•</span>
                            {ms}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessibility Audit */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("accessibilityAudit")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Accessibility
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">15. Accessibility Audit</span>
                <h3 className="text-lg font-bold text-white mt-1">WCAG 2.1 Compliance checklist</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {[
                    { title: "Color Contrast", text: blueprint.accessibilityAudit.contrast },
                    { title: "Keyboard Navigation", text: blueprint.accessibilityAudit.keyboard },
                    { title: "Screen Readers", text: blueprint.accessibilityAudit.screenReader },
                    { title: "Focus States", text: blueprint.accessibilityAudit.focusState },
                    { title: "Mobile Usability", text: blueprint.accessibilityAudit.mobileUsability }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">{item.title}</span>
                      <p className="text-xs text-slate-300 leading-normal">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsive design adaptation */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("responsiveDesign")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Responsive
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">16. Responsive Adaptation</span>
                <h3 className="text-lg font-bold text-white mt-1">Layout Grid Scaling</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                    <span className="px-2.5 py-1 text-[9px] font-bold bg-black/40 border border-white/10 rounded text-slate-400 font-mono uppercase">Mobile Aspect</span>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1.5">{blueprint.responsiveDesign.mobile}</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                    <span className="px-2.5 py-1 text-[9px] font-bold bg-black/40 border border-white/10 rounded text-slate-400 font-mono uppercase">Tablet Aspect</span>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1.5">{blueprint.responsiveDesign.tablet}</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1.5">
                    <span className="px-2.5 py-1 text-[9px] font-bold bg-black/40 border border-white/10 rounded text-slate-400 font-mono uppercase">Desktop Aspect</span>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1.5">{blueprint.responsiveDesign.desktop}</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: Prompts & Mockups */}
          {activeCategory === "mockups" && (
            <div className="space-y-6">
              
              {/* AI Prompt generators */}
              <div className="frosted-card p-6 space-y-4 relative">
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setRegeneratingSectionId("aiPrompts")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate Prompts
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">17. AI Assistant Prompt Generators</span>
                <h3 className="text-lg font-bold text-white mt-1">Coded Execution Commands</h3>
                
                <div className="space-y-4 pt-2">
                  {[
                    { name: "Gemini SDK prompt", key: "gemini", text: blueprint.aiPrompts.gemini },
                    { name: "Cursor / Claude / Lovable prompt", key: "claude", text: blueprint.aiPrompts.claude },
                    { name: "v0 / Bolt design prompt", key: "v0", text: blueprint.aiPrompts.v0 },
                    { name: "Standard LLM prompt (ChatGPT, etc.)", key: "chatgpt", text: blueprint.aiPrompts.chatgpt }
                  ].map((pr) => (
                    <div key={pr.key} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-blue-400">{pr.name}</span>
                        <button
                          onClick={() => handleCopy(pr.text, pr.key)}
                          className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-full transition-colors cursor-pointer"
                        >
                          {copiedText === pr.key ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Prompt
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="font-mono text-xs bg-black/30 p-3.5 rounded-xl border border-white/5 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                        {pr.text}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nano Banana Image Mockup generator section */}
              <div className="frosted-card p-6 space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">18. High-Fidelity UI Mockups</span>
                <h3 className="text-lg font-bold text-white mt-1">Nano Banana Model Concepts</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Trigger the real Nano Banana model (`gemini-3.1-flash-lite-image`) directly to generate consistent, professional mockup concepts based on your style guide rules and chosen brand color hexes:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {(["Dashboard", "Login page", "Mobile screens", "Landing page", "Analytics page"] as const).map((mockType) => {
                    const savedMock = getMockupForType(mockType);
                    const isGeneratingThis = generatingMockupType === mockType;

                    return (
                      <div key={mockType} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden">
                        
                        {/* Title block */}
                        <div>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/30 border border-white/10 text-slate-400 uppercase">
                            Concept View
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1.5">{mockType} Representation</h4>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                            A highly cohesive {blueprint.designStyle} view colored with {blueprint.brandColors.primary} and {blueprint.brandColors.secondary}.
                          </p>
                        </div>

                        {/* Rendering sandbox window */}
                        <div className="aspect-video bg-black/30 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center relative">
                          
                          {/* Generated image */}
                          {savedMock?.imageUrl ? (
                            <img 
                              src={savedMock.imageUrl} 
                              alt={`${mockType} Mockup`} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : isGeneratingThis ? (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center space-y-3">
                              <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <div className="space-y-1">
                                <span className="text-xs font-bold text-white block">Generating Mockup...</span>
                                <span className="text-[10px] text-blue-400 font-medium block animate-pulse">
                                  {LOADING_MESSAGES[loadingMessageIdx]}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <MockupFallback 
                              type={mockType}
                              primary={blueprint.brandColors.primary}
                              secondary={blueprint.brandColors.secondary}
                              style={blueprint.designStyle}
                              idea={blueprint.idea}
                            />
                          )}
                        </div>

                        {/* Trigger button */}
                        <div className="pt-2">
                          <button
                            disabled={generatingMockupType !== null}
                            onClick={() => handleGenerateMockup(mockType)}
                            className={`w-full py-2.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              generatingMockupType !== null 
                                ? "bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed"
                                : savedMock?.imageUrl 
                                ? "bg-white/5 hover:bg-white/10 border border-white/10 text-blue-400 hover:text-blue-300" 
                                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/10"
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            {savedMock?.imageUrl ? "Regenerate Concept Image" : "Generate Concept Image"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ==========================================
// Dynamic high-fidelity CSS wireframe mockup falls
// ==========================================
function MockupFallback({ 
  type, 
  primary = "#3b82f6", 
  secondary = "#1e293b", 
  style = "SaaS Dashboard", 
  idea = "" 
}: { 
  type: string; 
  primary: string; 
  secondary: string; 
  style: string; 
  idea: string; 
}) {
  const isMinimalist = style === "Minimalist";
  const isApple = style === "Apple-like" || style === "Apple Editorial";
  const isGlass = style === "Glassmorphism";
  const isCyber = style === "Cyberpunk";
  const isBrutal = style === "Neo-brutalism";
  const isSaaS = style === "SaaS Dashboard" || (!isMinimalist && !isApple && !isGlass && !isCyber && !isBrutal);

  let containerClass = "w-full h-full flex flex-col overflow-hidden text-slate-200 select-none text-[10px] relative ";
  if (isMinimalist) containerClass += "bg-[#fafafa] text-slate-900 font-sans";
  else if (isApple) containerClass += "bg-[#09090b] text-[#f5f5f7] font-sans";
  else if (isGlass) containerClass += "bg-[#030712] text-slate-100 font-sans";
  else if (isCyber) containerClass += "bg-black text-[#00ffcc] font-mono border border-[#00ffcc]/30";
  else if (isBrutal) containerClass += "bg-[#fefce8] text-black border-2 border-black";
  else containerClass += "bg-[#0b0f19] text-slate-200 font-sans";

  let cardClass = "";
  if (isMinimalist) cardClass = "bg-white border border-slate-200/60 rounded-md shadow-none";
  else if (isApple) cardClass = "bg-[#1c1c1e]/70 border border-[#2c2c2e]/80 rounded-2xl shadow-md";
  else if (isGlass) cardClass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg";
  else if (isCyber) cardClass = "bg-black border border-[#ff0055]/60 rounded-none shadow-[2px_2px_0px_#00ffcc]";
  else if (isBrutal) cardClass = "bg-white border-2 border-black shadow-[3px_3px_0px_#000000] rounded-none";
  else cardClass = "bg-[#111827] border border-white/10 rounded-xl shadow-xl";

  const cleanIdea = idea ? idea.substring(0, 16) : "Digital Hub";

  if (type === "Dashboard") {
    return (
      <div className={containerClass}>
        {/* Top Header */}
        <div className={`flex items-center justify-between px-3 py-1.5 border-b ${isBrutal ? "border-b-2 border-black bg-white" : isMinimalist ? "border-b border-slate-200/60 bg-white" : "border-b border-white/10 bg-black/20"}`}>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
            <span className="truncate max-w-[100px]">{cleanIdea}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-14 h-3.5 rounded flex items-center px-1 text-[7px] ${isBrutal ? "border border-black" : isMinimalist ? "bg-slate-100 text-slate-400" : "bg-white/5 text-slate-500"}`}>Search...</span>
            <span className="w-3.5 h-3.5 rounded-full bg-slate-700" style={{ backgroundColor: secondary }} />
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Mini Sidebar */}
          <div className={`w-10 border-r ${isBrutal ? "border-r-2 border-black bg-white" : isMinimalist ? "border-r border-slate-200/60 bg-white" : "border-r border-white/10 bg-black/10"} p-1.5 space-y-1.5`}>
            <span className="block h-2 rounded-sm bg-black/20" style={isBrutal ? { border: "1px solid black" } : { backgroundColor: primary }} />
            <span className="block h-2 rounded-sm bg-black/10" />
            <span className="block h-2 rounded-sm bg-black/10" />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-2 space-y-2 overflow-hidden flex flex-col justify-between">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-1.5">
              <div className={`${cardClass} p-1.5 flex flex-col justify-between h-10`}>
                <span className="text-[6px] text-slate-500 font-bold uppercase">Users</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-black">1,842</span>
                  <span className="text-[5px] text-emerald-500 font-bold">+14%</span>
                </div>
              </div>
              <div className={`${cardClass} p-1.5 flex flex-col justify-between h-10`}>
                <span className="text-[6px] text-slate-500 font-bold uppercase">Load</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-black">94.3%</span>
                  <span className="text-[5px] text-emerald-500 font-bold">Stable</span>
                </div>
              </div>
              <div className={`${cardClass} p-1.5 flex flex-col justify-between h-10`}>
                <span className="text-[6px] text-slate-500 font-bold uppercase">Uptime</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-black">99.98%</span>
                </div>
              </div>
            </div>

            {/* Visual graph chart */}
            <div className={`${cardClass} p-1.5 flex-1 flex flex-col justify-between h-16`}>
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-bold">Workspace Throughput</span>
                <span className="text-[5px] font-mono" style={{ color: primary }}>Live Stream</span>
              </div>
              <div className="flex-1 w-full flex items-end gap-1 pt-1">
                {[30, 45, 35, 60, 50, 75, 40, 85, 95, 70, 90, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full">
                    <div 
                      className="w-full rounded-t-[1px]" 
                      style={{ 
                        height: `${h}%`, 
                        backgroundColor: i % 2 === 0 ? primary : `${primary}44`,
                        border: isBrutal ? "1px solid black" : "none"
                      }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "Login page") {
    return (
      <div className={`${containerClass} flex items-center justify-center p-3 relative`}>
        {isGlass && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full filter blur-xl opacity-20" style={{ backgroundColor: primary }} />
        )}
        <div className={`${cardClass} w-44 p-2.5 space-y-2 relative z-10`}>
          <div className="text-center space-y-0.5">
            <span className="w-5 h-5 mx-auto rounded flex items-center justify-center font-bold text-[8px] text-white" style={isBrutal ? { backgroundColor: primary, border: "1.5px solid black" } : { backgroundColor: primary }}>
              ★
            </span>
            <h4 className="text-[9px] font-black">{cleanIdea} login</h4>
            <p className="text-[5px] text-slate-500">Sign in to sync your designs</p>
          </div>

          <div className="space-y-1">
            <div className={`h-4.5 rounded px-1.5 border flex items-center text-[7px] ${isBrutal ? "border-black bg-white text-black" : isMinimalist ? "border-slate-200 bg-slate-50 text-slate-400" : "border-white/10 bg-black/30 text-slate-500"}`}>
              <span>user@company.com</span>
            </div>
            <div className={`h-4.5 rounded px-1.5 border flex items-center justify-between text-[7px] ${isBrutal ? "border-black bg-white text-black" : isMinimalist ? "border-slate-200 bg-slate-50 text-slate-400" : "border-white/10 bg-black/30 text-slate-500"}`}>
              <span>••••••••</span>
              <span className="text-[5px]" style={{ color: primary }}>Show</span>
            </div>
          </div>

          <button 
            className={`w-full h-5 rounded text-[7px] font-bold text-white flex items-center justify-center cursor-pointer transition-all ${isBrutal ? "border border-black shadow-[1.5px_1.5px_0px_#000000] text-black font-extrabold" : ""}`}
            style={isBrutal ? { backgroundColor: primary } : { backgroundColor: primary }}
          >
            Authenticate Credentials
          </button>
        </div>
      </div>
    );
  }

  if (type === "Mobile screens") {
    return (
      <div className={`${containerClass} flex items-center justify-center p-2`}>
        <div className={`w-[90px] h-[135px] rounded-[14px] border-[3px] ${isBrutal ? "border-black bg-[#fefce8]" : "border-slate-800 bg-[#0d0e12]"} shadow-lg overflow-hidden flex flex-col relative`}>
          <div className="absolute top-0 inset-x-0 h-2.5 flex items-center justify-center z-20">
            <div className="w-8 h-1 rounded-full bg-slate-900" />
          </div>

          <div className="flex-1 pt-3.5 px-1.5 pb-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/5 pb-1">
              <span className="text-[6px] font-black truncate max-w-[50px]">{cleanIdea}</span>
              <span className="w-2.5 h-2.5 rounded-full flex items-center justify-center font-bold text-[5px] text-white" style={{ backgroundColor: primary }}>
                U
              </span>
            </div>

            <div className="flex-1 py-1 space-y-1 overflow-hidden">
              <div className={`${cardClass} p-1 space-y-0.5`}>
                <span className="text-[5px] text-slate-500 uppercase font-bold block">Status Metrics</span>
                <span className="text-[8px] font-bold">12.4 Hours</span>
              </div>

              {/* Mini progress bar */}
              <div className="space-y-0.5">
                <span className="text-[4px] text-slate-500 block">Weekly Sprint Target</span>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden" style={isBrutal ? { border: "1px solid black" } : {}}>
                  <div className="h-full rounded-full" style={{ width: "70%", backgroundColor: primary }} />
                </div>
              </div>
            </div>

            <div className={`border-t ${isBrutal ? "border-t-2 border-black bg-white" : "border-t border-white/5"} pt-1 flex items-center justify-around text-[4px] text-slate-500`}>
              <span className="font-bold" style={{ color: primary }}>Home</span>
              <span>Stats</span>
              <span>Prefs</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "Landing page") {
    return (
      <div className={containerClass}>
        {/* Navbar */}
        <div className={`flex items-center justify-between px-3 py-1 border-b ${isBrutal ? "border-b-2 border-black bg-white" : isMinimalist ? "border-b border-slate-200/60 bg-white" : "border-b border-white/10 bg-black/20"}`}>
          <div className="flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: primary }} />
            <span className="text-[7px] truncate max-w-[80px]">{cleanIdea}</span>
          </div>
          <div className="flex items-center gap-2 text-[6px] text-slate-500">
            <span>Features</span>
            <span>Pricing</span>
            <button className="h-3.5 px-1.5 rounded font-bold text-white text-[5px] cursor-pointer" style={isBrutal ? { backgroundColor: primary, border: "1px solid black" } : { backgroundColor: primary }}>
              Deploy
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="flex-1 p-3 flex flex-col justify-center items-center text-center space-y-1.5 relative overflow-hidden">
          {isGlass && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full filter blur-2xl opacity-15" style={{ backgroundColor: primary }} />
          )}

          <div className="space-y-0.5 max-w-[240px] relative z-10">
            <span className="px-1 py-0.25 rounded text-[4px] font-mono font-bold uppercase tracking-wider inline-block" style={isBrutal ? { border: "1px solid black", backgroundColor: primary, color: "black" } : { backgroundColor: `${primary}22`, color: primary }}>
              Deploy Sandbox
            </span>
            <h3 className="text-[9px] font-black tracking-tight leading-tight">
              Optimize Workspace for {idea ? idea.substring(0, 15) : "Your App"}
            </h3>
            <p className="text-[5.5px] text-slate-500 leading-tight max-w-[180px] mx-auto">
              Synthesize production-grade layout grids, customized design styles, and ready-to-run prompts automatically.
            </p>
          </div>

          <div className="flex items-center gap-1.5 relative z-10">
            <button className="h-4.5 px-2 rounded font-bold text-white text-[6px] cursor-pointer" style={isBrutal ? { backgroundColor: primary, border: "1px solid black" } : { backgroundColor: primary }}>
              Create Project
            </button>
            <button className={`h-4.5 px-1.5 rounded font-bold text-[6px] cursor-pointer border ${isBrutal ? "border-black bg-white" : "border-white/10 bg-white/5 text-slate-300"}`}>
              Sandbox
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: "Analytics page"
  return (
    <div className={containerClass}>
      {/* Header bar */}
      <div className={`flex items-center justify-between px-3 py-1 border-b ${isBrutal ? "border-b-2 border-black bg-white" : isMinimalist ? "border-b border-slate-200/60 bg-white" : "border-b border-white/10 bg-black/20"}`}>
        <span className="font-bold">Analytical Telemetry</span>
        <span className="px-1 py-0.25 rounded bg-black/20 text-[5px] border border-white/5 font-mono">Live Sync</span>
      </div>

      <div className="flex-1 p-1.5 grid grid-cols-12 gap-1.5 overflow-hidden">
        {/* Main graph */}
        <div className="col-span-8 flex flex-col h-full">
          <div className={`${cardClass} p-1.5 flex-1 flex flex-col justify-between`}>
            <span className="text-[6px] text-slate-500 font-bold block">Resource Consumption Rate</span>
            <div className="flex-1 w-full flex items-end pt-1 relative">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path 
                  d="M 0 90 Q 20 50, 40 60 T 70 30 T 100 10 L 100 100 Z" 
                  fill={isBrutal ? "transparent" : `${primary}15`} 
                />
                <path 
                  d="M 0 90 Q 20 50, 40 60 T 70 30 T 100 10" 
                  fill="none" 
                  stroke={primary} 
                  strokeWidth={isBrutal ? "2.5" : "1.5"} 
                />
                <circle cx="100" cy="10" r={isBrutal ? "2.5" : "1.5"} fill={primary} stroke={isBrutal ? "#000" : "#fff"} strokeWidth="0.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dial side */}
        <div className="col-span-4 flex flex-col h-full">
          <div className={`${cardClass} p-1.5 flex-1 flex flex-col items-center justify-center space-y-1`}>
            <span className="text-[5px] text-slate-500 font-bold block text-center">Score</span>
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="16" cy="16" r="12" fill="transparent" stroke={isBrutal ? "#000" : "rgba(255,255,255,0.05)"} strokeWidth="2" />
                <circle cx="16" cy="16" r="12" fill="transparent" stroke={primary} strokeWidth="2" strokeDasharray="75" strokeDashoffset="18" />
              </svg>
              <span className="absolute text-[7px] font-black">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

