import React, { useState } from "react";
import { Sparkles, Monitor, Tablet, Smartphone, Palette, User, Building, Cpu, Layers } from "lucide-react";

interface WizardProps {
  onSubmit: (data: {
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
  }) => void;
  isGenerating: boolean;
}

const INDUSTRY_PRESETS = [
  "Real Estate", "SaaS", "Finance", "Healthcare", "Fitness", 
  "E-commerce", "Social Media", "Education", "Developer Tools", "AI / Tech"
];

const STYLE_PRESETS = [
  { id: "Minimalist", name: "Minimalist", desc: "Clean typography, generous whitespace, subtle lines" },
  { id: "SaaS Dashboard", name: "SaaS Dashboard", desc: "High density data, clear cards, professional grids" },
  { id: "Apple-like", name: "Apple Editorial", desc: "San Francisco font, premium shadow, soft gray offsets" },
  { id: "Glassmorphism", name: "Glassmorphism", desc: "Translucent layers, backdrop blur, ambient neon glows" },
  { id: "Cyberpunk", name: "Cyberpunk", desc: "High contrast dark, neon glowing borders, tech accents" },
  { id: "Neo-brutalism", name: "Neo-brutalism", desc: "Thick black strokes, solid primary fills, flat drop shadows" }
];

const COLOR_PRESETS = [
  { name: "Ocean Slate", primary: "#0ea5e9", secondary: "#0f172a", hexCodes: ["#0ea5e9", "#0f172a", "#38bdf8", "#1e293b"] },
  { name: "Emerald Cyber", primary: "#10b981", secondary: "#064e3b", hexCodes: ["#10b981", "#064e3b", "#34d399", "#022c22"] },
  { name: "Neon Violet", primary: "#8b5cf6", secondary: "#1e1b4b", hexCodes: ["#8b5cf6", "#1e1b4b", "#a78bfa", "#311042"] },
  { name: "Amber Retro", primary: "#f59e0b", secondary: "#18181b", hexCodes: ["#f59e0b", "#18181b", "#fbbf24", "#27272a"] },
  { name: "Sunset Crimson", primary: "#ef4444", secondary: "#1e293b", hexCodes: ["#ef4444", "#1e293b", "#f87171", "#0f172a"] }
];

export default function NewBlueprintWizard({ onSubmit, isGenerating }: WizardProps) {
  const [idea, setIdea] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [platform, setPlatform] = useState("Web App");
  const [industry, setIndustry] = useState("SaaS");
  const [designStyle, setDesignStyle] = useState("SaaS Dashboard");
  const [customPrimary, setCustomPrimary] = useState("#6366f1");
  const [customSecondary, setCustomSecondary] = useState("#0f172a");
  const [selectedColorPreset, setSelectedColorPreset] = useState(0);
  const [aiModel, setAiModel] = useState("gemini-3.5-flash");

  const handlePresetSelect = (idx: number) => {
    setSelectedColorPreset(idx);
    setCustomPrimary(COLOR_PRESETS[idx].primary);
    setCustomSecondary(COLOR_PRESETS[idx].secondary);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    const brandColors = {
      primary: customPrimary,
      secondary: customSecondary,
      hexCodes: [
        customPrimary, 
        customSecondary, 
        `${customPrimary}88`, // tint/transparency
        "#ffffff", 
        "#09090b"
      ]
    };

    onSubmit({
      idea,
      targetAudience: targetAudience || "General Public",
      platform,
      industry,
      designStyle,
      brandColors,
      aiModel
    });
  };

  return (
    <div id="new-blueprint-wizard" className="w-full max-w-4xl mx-auto py-4 px-2">
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Banner header */}
        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-950/30 border border-blue-500/30 rounded-full">
                AI UX Co-Pilot
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-3">
                Design Your Next Digital Product
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Describe your app idea, set design criteria, and let the AI compile a comprehensive blueprint, wireframes, style guide, and ready-to-code prompts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-400 animate-pulse hidden md:block" />
            </div>
          </div>
        </div>

        {/* Grid fields */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Idea and Audience - Left Column (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            <div className="frosted-card p-6 space-y-4">
              <label htmlFor="app-idea-input" className="block text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                What is your App Idea? <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="app-idea-input"
                required
                rows={4}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your vision (e.g., 'A mobile fitness companion matching starting runners with personal coaches via live scheduling, automated chat, and route analytics...')"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-y leading-relaxed"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="target-audience" className="block text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Target Audience
                  </label>
                  <input
                    id="target-audience"
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Beginners, Athletes, Designers"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="industry-select" className="block text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Industry Category
                  </label>
                  <select
                    id="industry-select"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    {INDUSTRY_PRESETS.map((ind) => (
                      <option key={ind} value={ind} className="bg-slate-900">{ind}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Design Style Selector */}
            <div className="frosted-card p-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Select Preferred Design Style
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STYLE_PRESETS.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setDesignStyle(style.id)}
                    className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 ${
                      designStyle === style.id 
                        ? "bg-white/10 border-white/35 shadow-md shadow-blue-500/5 text-white" 
                        : "bg-black/20 border-white/5 text-slate-400 hover:border-white/15 hover:bg-white/5"
                    }`}
                  >
                    <span className={`text-sm font-bold ${designStyle === style.id ? "text-blue-400" : "text-slate-300"}`}>
                      {style.name}
                    </span>
                    <span className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {style.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Platforms, Colors and AI Model - Right Column (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Platforms Selector */}
            <div className="frosted-card p-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-300">
                Target Platform
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "Web", icon: Monitor },
                  { name: "Mobile", icon: Smartphone },
                  { name: "Cross", icon: Tablet }
                ].map((plat) => {
                  const Icon = plat.icon;
                  return (
                    <button
                      key={plat.name}
                      type="button"
                      onClick={() => setPlatform(plat.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        platform === plat.name 
                          ? "bg-white/10 border-white/30 text-blue-400" 
                          : "bg-black/20 border-white/5 text-slate-400 hover:border-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-semibold">{plat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors Config */}
            <div className="frosted-card p-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-blue-400" />
                Brand Color Palette
              </label>
              
              {/* Color Presets list */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Presets</span>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PRESETS.map((preset, idx) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handlePresetSelect(idx)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
                        selectedColorPreset === idx 
                          ? "bg-white/10 border-white/30 text-white" 
                          : "bg-black/20 border-white/5 text-slate-400 hover:border-white/10"
                      }`}
                    >
                      <span 
                        className="w-2.5 h-2.5 rounded-full inline-block shadow-sm" 
                        style={{ backgroundColor: preset.primary }} 
                      />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Custom Colors</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-medium mb-1">Primary Hex</label>
                    <div className="flex items-center gap-1.5 bg-black/20 border border-white/10 rounded-lg p-1 px-2">
                      <input 
                        type="color" 
                        value={customPrimary} 
                        onChange={(e) => {
                          setCustomPrimary(e.target.value);
                          setSelectedColorPreset(-1);
                        }}
                        className="w-5 h-5 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customPrimary} 
                        onChange={(e) => {
                          setCustomPrimary(e.target.value);
                          setSelectedColorPreset(-1);
                        }}
                        className="w-full bg-transparent text-xs text-slate-300 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-slate-400 font-medium mb-1">Secondary Hex</label>
                    <div className="flex items-center gap-1.5 bg-black/20 border border-white/10 rounded-lg p-1 px-2">
                      <input 
                        type="color" 
                        value={customSecondary} 
                        onChange={(e) => {
                          setCustomSecondary(e.target.value);
                          setSelectedColorPreset(-1);
                        }}
                        className="w-5 h-5 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={customSecondary} 
                        onChange={(e) => {
                          setCustomSecondary(e.target.value);
                          setSelectedColorPreset(-1);
                        }}
                        className="w-full bg-transparent text-xs text-slate-300 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Model Select */}
            <div className="frosted-card p-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                AI Strategy Model
              </label>
              
              <div className="space-y-2">
                {[
                  { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash", desc: "Super-fast, crisp modern UI insights" },
                  { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", desc: "Deep reasoning & architecture maps" }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setAiModel(m.id)}
                    className={`w-full flex flex-col text-left p-3 rounded-xl border transition-all ${
                      aiModel === m.id 
                        ? "bg-white/10 border-white/30 text-white" 
                        : "bg-black/20 border-white/5 text-slate-400 hover:border-white/10"
                    }`}
                  >
                    <span className="text-xs font-bold">{m.name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Generate Trigger */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isGenerating || !idea.trim()}
            className={`w-full md:w-auto md:px-12 py-4 rounded-full font-bold text-sm text-white tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
              isGenerating || !idea.trim()
                ? "bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95 shadow-lg shadow-blue-500/20 cursor-pointer hover:scale-[1.01] border border-white/10"
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white animate-pulse" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Assembling Product Blueprint...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                Generate UX Design Blueprint
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
