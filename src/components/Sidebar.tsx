import React, { useState } from "react";
import { Plus, Search, Star, Trash2, Calendar, Layout, FolderKanban, ShieldCheck } from "lucide-react";
import { Blueprint } from "../types";

interface SidebarProps {
  blueprints: Blueprint[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onNewClick: () => void;
}

export default function Sidebar({
  blueprints,
  activeId,
  onSelect,
  onDelete,
  onToggleFavorite,
  onNewClick
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Filter list
  const filteredBlueprints = blueprints.filter((bp) => {
    const matchesSearch = bp.idea.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bp.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = !showOnlyFavorites || bp.isFavorite;
    return matchesSearch && matchesFav;
  });

  return (
    <div id="project-sidebar" className="w-full md:w-80 h-full frosted-sidebar flex flex-col overflow-hidden relative z-10">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 bg-black/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-white uppercase flex items-center gap-1.5 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              AI UX DESIGNER
            </h1>
            <span className="text-[10px] text-slate-500 font-mono block">Product Architect v1.5</span>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="p-4 border-b border-white/5">
        <button
          onClick={onNewClick}
          className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
        >
          <Plus className="w-4 h-4" />
          New Blueprint
        </button>
      </div>

      {/* Filter and Search rail */}
      <div className="p-4 space-y-3 border-b border-white/5">
        <div className="relative">
          <Search className="absolute top-3 left-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search blueprints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
          />
        </div>

        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
            showOnlyFavorites 
              ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
              : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-300 hover:bg-white/10"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? "fill-blue-400" : ""}`} />
            Show Favorites Only
          </span>
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-slate-500">
            {blueprints.filter((b) => b.isFavorite).length}
          </span>
        </button>
      </div>

      {/* Saved list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
          History ({filteredBlueprints.length})
        </span>

        {filteredBlueprints.length === 0 ? (
          <div className="py-12 text-center text-slate-600 space-y-2">
            <FolderKanban className="w-8 h-8 mx-auto stroke-1" />
            <p className="text-xs">No blueprints found.</p>
          </div>
        ) : (
          filteredBlueprints.map((bp) => {
            const isActive = bp.id === activeId;
            const dateStr = new Date(bp.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div
                key={bp.id}
                onClick={() => onSelect(bp.id)}
                className={`group relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                  isActive
                    ? "bg-white/10 border-white/20 shadow-md shadow-blue-500/5 text-white"
                    : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10"
                }`}
              >
                {/* Favorites button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(bp.id);
                  }}
                  className="absolute top-3.5 right-3.5 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-amber-400 transition-colors"
                >
                  <Star className={`w-4 h-4 ${bp.isFavorite ? "text-amber-400 fill-amber-400" : ""}`} />
                </button>

                <div className="pr-6">
                  <h3 className={`text-xs font-bold line-clamp-2 leading-relaxed ${isActive ? "text-blue-400" : "text-slate-200 group-hover:text-white"}`}>
                    {bp.idea}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-white/5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 border border-white/10 text-slate-400 font-mono">
                    {bp.industry}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 border border-white/10 text-slate-400 font-mono">
                    {bp.platform}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {dateStr}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(bp.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition-all"
                    title="Delete blueprint"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Workspace Health Indicator */}
      <div className="p-4 border-t border-white/5 bg-black/10 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          Cloud Security Active
        </span>
        <span className="text-[10px] text-slate-500 font-mono">UTC-7 Local</span>
      </div>
    </div>
  );
}
