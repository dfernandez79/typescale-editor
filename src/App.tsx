import { useRef, useState } from "react";
import { CssEditor, type CssEditorHandle } from "./components/CssEditor";
import { PreviewPanel } from "./components/PreviewPanel";
import { FontPickerModal } from "./components/FontPickerModal";
import { ScaleMenu } from "./components/ScaleMenu";
import { DEFAULT_CSS, DEFAULT_MARKDOWN } from "./lib/defaultContent";
import "./index.css";

export function App() {
  const [cssText, setCssText] = useState(DEFAULT_CSS);
  const [markdownText, setMarkdownText] = useState(DEFAULT_MARKDOWN);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const editorRef = useRef<CssEditorHandle>(null);

  function insertText(text: string) {
    editorRef.current?.insertText(text);
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Toolbar */}
      <header className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border-b border-zinc-700 shrink-0">
        <span className="font-semibold text-sm tracking-tight text-zinc-300 mr-2">
          Typescale Editor
        </span>
        <div className="w-px h-4 bg-zinc-700" />
        <button
          onClick={() => setShowFontPicker(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-100 transition-colors"
          title="Search Google Fonts and insert @import"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5l3 3" />
          </svg>
          Insert Font
        </button>
        <ScaleMenu onInsert={insertText} />
        <div className="flex-1" />
        <span className="text-xs text-zinc-500">
          Drop a .md file on the preview to load it
        </span>
      </header>

      {/* Main panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: CSS editor */}
        <div className="flex flex-col w-1/2 border-r border-zinc-700 overflow-hidden">
          <div className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 border-b border-zinc-700 shrink-0">
            CSS
          </div>
          <div className="flex-1 overflow-hidden">
            <CssEditor ref={editorRef} value={cssText} onChange={setCssText} />
          </div>
        </div>

        {/* Right: Markdown preview */}
        <div className="flex flex-col w-1/2 overflow-hidden">
          <div className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 border-b border-zinc-700 shrink-0">
            Preview
          </div>
          <div className="flex-1 overflow-hidden">
            <PreviewPanel
              css={cssText}
              markdown={markdownText}
              onMarkdownChange={setMarkdownText}
            />
          </div>
        </div>
      </div>

      {/* Font picker modal */}
      {showFontPicker && (
        <FontPickerModal
          onInsert={insertText}
          onClose={() => setShowFontPicker(false)}
        />
      )}
    </div>
  );
}

export default App;
