"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Eye, 
  Code, 
  Columns, 
  Save, 
  RotateCcw, 
  Layout, 
  Maximize2, 
  Minimize2,
  History,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface AdminEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

type EditorMode = "edit" | "preview" | "split";
type ContentType = "markdown" | "html";

export default function AdminEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing...", 
  label = "Content",
  id
}: AdminEditorProps) {
  const [mode, setMode] = useState<EditorMode>("split");
  const [contentType, setContentType] = useState<ContentType>("markdown");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <div className={`flex flex-col gap-3 transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-[100] bg-background p-6" : "w-full"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground/40">{label}</label>
          <div className="flex bg-surface-high/40 rounded-lg p-0.5 border border-outline/10">
            <button 
              type="button"
              onClick={() => setContentType("markdown")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] uppercase tracking-wider font-bold transition-all ${contentType === "markdown" ? "bg-primary text-surface-lowest" : "text-foreground/40 hover:text-foreground"}`}
            >
              <Layout size={11} /> MD
            </button>
            <button 
              type="button"
              onClick={() => setContentType("html")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] uppercase tracking-wider font-bold transition-all ${contentType === "html" ? "bg-primary text-surface-lowest" : "text-foreground/40 hover:text-foreground"}`}
            >
              <Code size={11} /> HTML
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-surface-high/40 rounded-lg p-0.5 border border-outline/10 mr-2">
            <button 
              type="button"
              onClick={() => setMode("edit")}
              className={`p-1.5 rounded-md transition-all ${mode === "edit" ? "bg-surface-high shadow-sm text-primary" : "text-foreground/40 hover:text-foreground"}`}
              title="Edit Mode"
            >
              <Code size={14} />
            </button>
            <button 
              type="button"
              onClick={() => setMode("split")}
              className={`p-1.5 rounded-md transition-all ${mode === "split" ? "bg-surface-high shadow-sm text-primary" : "text-foreground/40 hover:text-foreground"}`}
              title="Split View"
            >
              <Columns size={14} />
            </button>
            <button 
              type="button"
              onClick={() => setMode("preview")}
              className={`p-1.5 rounded-md transition-all ${mode === "preview" ? "bg-surface-high shadow-sm text-primary" : "text-foreground/40 hover:text-foreground"}`}
              title="Preview Mode"
            >
              <Eye size={14} />
            </button>
          </div>
          
          <button 
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-surface-high/40 border border-outline/10 text-foreground/40 hover:text-foreground transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      <div className={`grid gap-4 transition-all duration-300 ${mode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} flex-1`}>
        {/* Editor Pane */}
        {(mode === "edit" || mode === "split") && (
          <GlassCard className={`flex flex-col p-0 overflow-hidden border-outline/15 min-h-[400px] ${isFullscreen ? "h-[calc(100vh-140px)]" : ""}`}>
            <textarea
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={contentType === "html" ? "Paste your Tailwind HTML here..." : "Write your Markdown content here..."}
              className="flex-1 w-full bg-transparent p-6 font-mono text-sm resize-none focus:outline-none leading-relaxed custom-scrollbar"
              spellCheck={false}
            />
            <div className="bg-surface-low/50 px-4 py-2 border-t border-outline/10 flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-widest text-foreground/30 font-bold">
                {contentType.toUpperCase()} Mode
              </span>
              <span className="text-[9px] uppercase tracking-widest text-foreground/30 font-bold font-mono">
{value?.length ?? 0} characters
              </span>
            </div>
          </GlassCard>
        )}

        {/* Preview Pane */}
        {(mode === "preview" || mode === "split") && (
          <GlassCard className={`flex flex-col p-0 overflow-hidden border-outline/15 bg-surface-lowest/50 min-h-[400px] ${isFullscreen ? "h-[calc(100vh-140px)]" : ""}`}>
            <div className="flex-1 w-full overflow-y-auto p-8 custom-scrollbar bg-surface-lowest/30">
              {value ? (
                <MarkdownRenderer content={value} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 mt-12">
                  <Eye size={48} className="mb-4" />
                  <p className="font-display font-medium text-sm">Preview will appear here</p>
                </div>
              )}
            </div>
            <div className="bg-surface-low/50 px-4 py-2 border-t border-outline/10 flex items-center">
              <span className="text-[9px] uppercase tracking-widest text-foreground/30 font-bold flex items-center gap-1.5">
                <Layout size={10} /> Dynamic Render
              </span>
            </div>
          </GlassCard>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--outline);
          opacity: 0.1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
      `}</style>
    </div>
  );
}
