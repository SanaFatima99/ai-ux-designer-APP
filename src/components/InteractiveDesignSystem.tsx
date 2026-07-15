import React, { useState } from "react";
import { Copy, Check, Eye, Code, Paintbrush, ChevronRight } from "lucide-react";
import { DesignSystem, ColorDefinition } from "../types";

interface InteractiveDesignSystemProps {
  designSystem: DesignSystem;
  styleName: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function InteractiveDesignSystem({
  designSystem,
  styleName,
  primaryColor,
  secondaryColor
}: InteractiveDesignSystemProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "colors" | "typography" | "tokens">("preview");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Get dynamic custom style styles
  const getStyleClasses = () => {
    switch (styleName) {
      case "Minimalist":
        return {
          buttonPrimary: "border border-white hover:bg-white hover:text-black text-white font-sans text-xs uppercase tracking-widest px-5 py-2.5 transition-colors duration-200 rounded-none",
          buttonSecondary: "border border-zinc-800 hover:border-zinc-500 text-zinc-300 font-sans text-xs uppercase tracking-widest px-5 py-2.5 transition-colors duration-200 rounded-none",
          card: "border border-zinc-800 bg-black p-6 rounded-none space-y-4",
          input: "w-full bg-black border border-zinc-800 text-white rounded-none px-4 py-2.5 text-xs focus:border-white focus:outline-none transition-colors"
        };
      case "Apple-like":
        return {
          buttonPrimary: "bg-white text-black hover:bg-neutral-200 font-sans font-normal text-sm rounded-full px-5 py-2.5 transition-all shadow-sm hover:scale-[1.01] active:scale-[0.98]",
          buttonSecondary: "bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-800 font-sans font-normal text-sm rounded-full px-5 py-2.5 transition-all border border-neutral-800",
          card: "bg-neutral-900/40 border border-neutral-800/60 shadow-xl rounded-2xl p-6 backdrop-blur-xl",
          input: "w-full bg-neutral-900/80 border border-neutral-800 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-neutral-400 focus:outline-none transition-all"
        };
      case "Glassmorphism":
        return {
          buttonPrimary: "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg rounded-xl px-5 py-2.5 transition-all",
          buttonSecondary: "bg-zinc-950/40 hover:bg-zinc-950/60 text-zinc-300 border border-white/5 backdrop-blur-sm rounded-xl px-5 py-2.5 transition-all",
          card: "bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-2xl p-6",
          input: "w-full bg-white/5 border border-white/15 text-white rounded-xl px-4 py-2.5 text-sm focus:border-white/30 focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/30"
        };
      case "Cyberpunk":
        return {
          buttonPrimary: "bg-transparent border border-[#00f0ff] text-[#00f0ff] font-mono text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all rounded-none skew-x-3",
          buttonSecondary: "bg-transparent border border-[#ff0055] text-[#ff0055] font-mono text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-[#ff0055] hover:text-black hover:shadow-[0_0_15px_rgba(255,0,85,0.4)] transition-all rounded-none skew-x-3",
          card: "border border-[#00f0ff] bg-slate-950/90 rounded-none p-6 relative before:absolute before:top-0 before:left-0 before:w-4 before:h-4 before:border-t-2 before:border-l-2 before:border-[#ff0055]",
          input: "w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono rounded-none px-4 py-2.5 text-xs focus:border-[#00f0ff] focus:outline-none transition-all placeholder:text-slate-700"
        };
      case "Neo-brutalism":
        return {
          buttonPrimary: "bg-amber-400 border-2 border-black text-black font-extrabold text-xs uppercase px-5 py-2.5 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-lg",
          buttonSecondary: "bg-white border-2 border-black text-black font-extrabold text-xs uppercase px-5 py-2.5 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-lg",
          card: "bg-[#fcf8f2] border-3 border-black p-6 rounded-xl shadow-[6px_6px_0px_#000] text-black",
          input: "w-full bg-white border-2 border-black text-black rounded-lg px-4 py-2.5 text-sm focus:bg-amber-50 focus:outline-none font-bold"
        };
      case "SaaS Dashboard":
      default:
        return {
          buttonPrimary: "text-white font-medium text-sm rounded-lg px-5 py-2.5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5",
          buttonSecondary: "bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-lg px-5 py-2.5 transition-all border border-slate-700",
          card: "bg-slate-900 border border-slate-800 shadow-xl rounded-xl p-6",
          input: "w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
        };
    }
  };

  const styleClasses = getStyleClasses();

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-900/40 p-1.5 gap-1">
        {[
          { id: "preview", name: "Interactive Preview", icon: Eye },
          { id: "colors", name: "Color Swatches", icon: Paintbrush },
          { id: "typography", name: "Typography Guide", icon: Code },
          { id: "tokens", name: "Tokens & Classes", icon: ChevronRight }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.name}
            </button>
          );
        })}
      </div>

      <div className="p-6">
        {activeTab === "preview" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Component Sandbox</span>
                <h4 className="text-sm font-bold text-white mt-0.5">Live CSS Rendering for style: <span className="text-indigo-400">{styleName}</span></h4>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800 rounded-full animate-pulse">
                Active Stylesheet
              </span>
            </div>

            {/* Sandbox Container */}
            <div className="p-8 rounded-xl bg-slate-950 border border-slate-900 flex flex-col md:flex-row gap-8 items-stretch justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:24px_24px] opacity-25"></div>
              
              {/* Card component in selected style */}
              <div className="flex-1 relative z-10">
                <div className={styleClasses.card}>
                  <div>
                    <h5 className={`font-bold ${styleName === "Neo-brutalism" ? "text-black text-lg" : "text-white text-md"}`}>
                      Product Blueprint Card
                    </h5>
                    <p className={`text-xs mt-1 ${styleName === "Neo-brutalism" ? "text-zinc-700" : "text-slate-400"}`}>
                      This is a real-time visual representation of how UI components render inside the generated application shell.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-[10px] font-bold tracking-wider ${styleName === "Neo-brutalism" ? "text-black" : "text-slate-400"}`}>
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      defaultValue="Sherlock Holmes" 
                      className={styleClasses.input}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <button 
                      type="button" 
                      className={styleClasses.buttonPrimary}
                      style={styleName === "SaaS Dashboard" ? { backgroundColor: primaryColor } : {}}
                    >
                      Save Changes
                    </button>
                    <button type="button" className={styleClasses.buttonSecondary}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Guide Pane */}
              <div className="w-full md:w-72 bg-slate-900/40 border border-slate-800/50 rounded-xl p-4 flex flex-col justify-between relative z-10 text-xs">
                <div className="space-y-3">
                  <span className="font-semibold text-slate-300 block">Design Guidelines</span>
                  <div className="space-y-2 text-slate-400 leading-relaxed">
                    <p><strong className="text-slate-200">Card Layout:</strong> {designSystem.cardStyles || "Beautiful border curves with offset backdrops."}</p>
                    <p><strong className="text-slate-200">Button State:</strong> {designSystem.buttonStyles || "Interactive scales on focus."}</p>
                    <p><strong className="text-slate-200">Form Inputs:</strong> {designSystem.formStyles || "Deep contrasting rings on user focus."}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">Theme compliant</span>
                  <button
                    onClick={() => handleCopy(`Button Class: ${styleClasses.buttonPrimary}\nCard Class: ${styleClasses.card}`, "sandbox-css")}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors text-[10px] font-semibold text-slate-400"
                  >
                    {copiedText === "sandbox-css" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        Copied Classes!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy CSS Classes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "colors" && (
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">Brand Palette Swatches</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {designSystem.colors.map((color, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col items-center text-center space-y-2">
                  <div 
                    className="w-12 h-12 rounded-xl shadow-lg border border-white/10" 
                    style={{ backgroundColor: color.value }} 
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">{color.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">{color.value}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 leading-snug pt-1 block border-t border-slate-900/60 w-full">
                    {color.use}
                  </span>
                </div>
              ))}
              
              {/* Extra default brand color presets if AI generated only a few */}
              {designSystem.colors.length < 4 && (
                <>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl shadow-lg bg-white border border-white/10" />
                    <div>
                      <span className="text-xs font-bold text-white block">Pure Light</span>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">#FFFFFF</span>
                    </div>
                    <span className="text-[10px] text-slate-400 leading-snug pt-1 block border-t border-slate-900/60 w-full">
                      Primary high contrast typography, white outlines
                    </span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl shadow-lg bg-slate-950 border border-slate-800" />
                    <div>
                      <span className="text-xs font-bold text-white block">Canvas Deep</span>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">#09090B</span>
                    </div>
                    <span className="text-[10px] text-slate-400 leading-snug pt-1 block border-t border-slate-900/60 w-full">
                      Primary background body canvas, workspace layout
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "typography" && (
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">Typography Architecture</span>
            <div className="bg-slate-950 rounded-xl border border-slate-900 overflow-hidden divide-y divide-slate-900">
              {designSystem.typography.map((type, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500">{type.element}</span>
                    <h5 className="text-sm font-bold text-white">{type.font} ({type.size})</h5>
                    <p className="text-xs text-slate-400">Weight: {type.weight}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500 font-mono block">Sample Render</span>
                    <span 
                      className="text-white inline-block mt-1 font-sans" 
                      style={{ fontSize: type.size.includes("32px") ? "24px" : type.size.includes("14px") ? "14px" : "16px", fontWeight: type.weight.toLowerCase() === "bold" ? "700" : "500" }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "tokens" && (
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">Spacing, Shadows, and Border Radius Global Tokens</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                <span className="text-xs font-bold text-white block">Spacing Steps</span>
                <div className="flex flex-wrap gap-1.5">
                  {designSystem.spacing.map((sp, idx) => (
                    <span key={idx} className="bg-slate-900 text-slate-300 font-mono text-xs px-2.5 py-1 rounded border border-slate-800">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                <span className="text-xs font-bold text-white block">Border Radius Bounds</span>
                <div className="flex flex-wrap gap-1.5">
                  {designSystem.borderRadius.map((br, idx) => (
                    <span key={idx} className="bg-slate-900 text-slate-300 font-mono text-xs px-2.5 py-1 rounded border border-slate-800">
                      {br}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                <span className="text-xs font-bold text-white block">Shadow Cast Classes</span>
                <div className="flex flex-wrap gap-1.5">
                  {designSystem.shadows.map((sh, idx) => (
                    <span key={idx} className="bg-slate-900 text-slate-300 font-mono text-xs px-2.5 py-1 rounded border border-slate-800">
                      {sh}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
