import React, { useState, useEffect } from "react";
import { Sparkles, HelpCircle, FileText, Moon, Sun, ArrowLeft, RefreshCw, Layers } from "lucide-react";
import { Blueprint } from "./types";
import { MOCK_BLUEPRINTS } from "./mockData";
import Sidebar from "./components/Sidebar";
import NewBlueprintWizard from "./components/NewBlueprintWizard";
import BlueprintView from "./components/BlueprintView";

const PROGRESS_STEPS = [
  "Consulting product strategy paradigms...",
  "Drafting product summary & value proposition...",
  "Evaluating user segments & goals...",
  "Structuring database schema & relational models...",
  "Compiling Rest API schemas & mock payloads...",
  "Formatting responsive design guidelines...",
  "Constructing ASCII layout wireframes...",
  "Synthesizing design system color swatches...",
  "Writing developer-ready prompts for Gemini & Cursor..."
];

export default function App() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [activeBlueprintId, setActiveBlueprintId] = useState<string | null>(null);
  
  // App UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load history from local storage or mock presets
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedId = urlParams.get("id");

    let loadedBlueprints: Blueprint[] = [];
    const saved = localStorage.getItem("ai-ux-designer-blueprints");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          loadedBlueprints = parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved blueprints:", e);
      }
    }
    
    if (loadedBlueprints.length === 0) {
      loadedBlueprints = MOCK_BLUEPRINTS;
    }

    setBlueprints(loadedBlueprints);

    if (sharedId) {
      const match = loadedBlueprints.find((bp) => bp.id === sharedId);
      if (match) {
        setActiveBlueprintId(sharedId);
        return;
      }
      const mockMatch = MOCK_BLUEPRINTS.find((bp) => bp.id === sharedId);
      if (mockMatch) {
        // If it's a mock blueprint that isn't in their current local history, prepend it
        const exists = loadedBlueprints.some((bp) => bp.id === sharedId);
        if (!exists) {
          const updated = [mockMatch, ...loadedBlueprints];
          setBlueprints(updated);
          localStorage.setItem("ai-ux-designer-blueprints", JSON.stringify(updated));
        }
        setActiveBlueprintId(sharedId);
        return;
      }
    }

    if (loadedBlueprints.length > 0) {
      setActiveBlueprintId(loadedBlueprints[0].id);
    }
  }, []);

  // Sync to local storage
  const syncAndSetBlueprints = (updatedList: Blueprint[]) => {
    setBlueprints(updatedList);
    localStorage.setItem("ai-ux-designer-blueprints", JSON.stringify(updatedList));
  };

  // Toggle favorite status
  const handleToggleFavorite = (id: string) => {
    const updated = blueprints.map((bp) => {
      if (bp.id === id) {
        return { ...bp, isFavorite: !bp.isFavorite };
      }
      return bp;
    });
    syncAndSetBlueprints(updated);
  };

  // Delete a blueprint
  const handleDeleteBlueprint = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to permanently delete this product blueprint?");
    if (!confirmed) return;

    const updated = blueprints.filter((bp) => bp.id !== id);
    syncAndSetBlueprints(updated);
    
    // If active was deleted, point to another or show wizard
    if (activeBlueprintId === id) {
      if (updated.length > 0) {
        setActiveBlueprintId(updated[0].id);
      } else {
        setActiveBlueprintId(null);
      }
    }
  };

  // Selection change
  const handleSelectBlueprint = (id: string) => {
    setActiveBlueprintId(id);
    setErrorMsg(null);
  };

  // Form submission: Generate full blueprint
  const handleGenerateBlueprint = async (wizardData: {
    idea: string;
    targetAudience: string;
    platform: string;
    industry: string;
    designStyle: string;
    brandColors: {
      primary: string;
      secondary: string;
      hexCodes: string[];
    };
    aiModel: string;
  }) => {
    setIsGenerating(true);
    setErrorMsg(null);
    setProgressText(PROGRESS_STEPS[0]);

    // Cycle through messages while waiting
    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx = (stepIdx + 1) % PROGRESS_STEPS.length;
      setProgressText(PROGRESS_STEPS[stepIdx]);
    }, 4000);

    try {
      const response = await fetch("/api/generate-blueprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(wizardData)
      });

      clearInterval(interval);

      if (!response.ok) {
        let errorMsg = "Failed to compile blueprint";
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } catch (e) {
            // ignore
          }
        } else {
          const text = await response.text();
          if (text.length > 0) {
            errorMsg = text.length > 200 ? `${text.substring(0, 200)}...` : text;
          }
        }
        throw new Error(errorMsg);
      }

      let rawBlueprint;
      try {
        rawBlueprint = await response.json();
      } catch (err) {
        throw new Error("Invalid response blueprint received from server.");
      }
      
      // Inject meta-data
      const newBlueprint: Blueprint = {
        ...rawBlueprint,
        id: `bp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        idea: wizardData.idea,
        targetAudience: wizardData.targetAudience,
        platform: wizardData.platform,
        industry: wizardData.industry,
        designStyle: wizardData.designStyle,
        brandColors: wizardData.brandColors,
        aiModel: wizardData.aiModel,
        isFavorite: false,
        mockups: [] // start empty
      };

      const updatedList = [newBlueprint, ...blueprints];
      syncAndSetBlueprints(updatedList);
      setActiveBlueprintId(newBlueprint.id);

    } catch (err: any) {
      console.error("Generation error:", err);
      setErrorMsg(err.message || "An unexpected network error occurred while reaching Gemini AI.");
    } finally {
      setIsGenerating(false);
      clearInterval(interval);
    }
  };

  // Callback to update an existing blueprint (e.g., when a section is regenerated or mockup is loaded)
  const handleUpdateBlueprint = (updated: Blueprint) => {
    const updatedList = blueprints.map((bp) => {
      if (bp.id === updated.id) {
        return updated;
      }
      return bp;
    });
    syncAndSetBlueprints(updatedList);
  };

  const activeBlueprint = blueprints.find((bp) => bp.id === activeBlueprintId);

  return (
    <div id="app-root" className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 bg-slate-950 text-slate-200 relative overflow-hidden`}>
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      {/* Top Navigation bar */}
      <header className="px-6 py-4 frosted-header flex items-center justify-between sticky top-0 z-30 print:hidden relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span className="font-extrabold text-sm tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              AI UX Designer
            </span>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full tracking-wider uppercase">
            Product Planner
          </span>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {activeBlueprintId && (
            <button
              onClick={() => setActiveBlueprintId(null)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-medium border border-white/10 text-slate-200 transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
              Reset Workspace
            </button>
          )}

          {/* Theme toggler */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>
        </div>
      </header>

      {/* Main split dashboard pane */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Sidebar history lists */}
        <Sidebar
          blueprints={blueprints}
          activeId={activeBlueprintId}
          onSelect={handleSelectBlueprint}
          onDelete={handleDeleteBlueprint}
          onToggleFavorite={handleToggleFavorite}
          onNewClick={() => {
            setActiveBlueprintId(null);
            setErrorMsg(null);
          }}
        />

        {/* Core display terminal */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {isGenerating ? (
            /* Premium compiling layout screen */
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-2 border-purple-500/10 border-b-purple-500 animate-spin [animation-duration:3s]"></div>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-white tracking-wide">Synthesizing Product Specs</h3>
                <p className="text-xs text-indigo-400 font-mono animate-pulse">
                  {progressText}
                </p>
                <p className="text-[10px] text-slate-600 leading-relaxed pt-2">
                  Gemini is researching similar industry products, generating accessible color contrast tokens, outlining REST routes, and preparing ASCII layout art...
                </p>
              </div>
            </div>
          ) : errorMsg ? (
            /* Error display screen */
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 text-center space-y-4">
              <div className="p-3.5 rounded-full bg-rose-950/50 border border-rose-800 text-rose-400">
                <HelpCircle className="w-8 h-8 stroke-1.5" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-md font-bold text-white">Compilation Interrupted</h3>
                <p className="text-xs text-rose-400">{errorMsg}</p>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Return to Editor
              </button>
            </div>
          ) : activeBlueprint ? (
            /* Render active blueprint documentation sections */
            <BlueprintView
              blueprint={activeBlueprint}
              onUpdateBlueprint={handleUpdateBlueprint}
            />
          ) : (
            /* Render new blueprint specifications wizard */
            <div className="flex-1 overflow-y-auto bg-slate-950/20">
              <NewBlueprintWizard
                onSubmit={handleGenerateBlueprint}
                isGenerating={isGenerating}
              />
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
