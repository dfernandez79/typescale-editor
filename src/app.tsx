import { useRef, useState } from 'react';
import { CssEditor, type CssEditorHandle } from './components/css-editor';
import { FontPickerModal } from './components/font-picker-modal';
import { PreviewPanel } from './components/preview-panel';
import { ScaleMenu } from './components/scale-menu';
import { DEFAULT_CSS, DEFAULT_MARKDOWN } from './lib/defaultContent';
import './index.css';

export function App() {
  const [cssText, setCssText] = useState(DEFAULT_CSS);
  const [markdownText, setMarkdownText] = useState(DEFAULT_MARKDOWN);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [cssCollapsed, setCssCollapsed] = useState(false);
  const editorRef = useRef<CssEditorHandle>(null);

  function insertText(text: string) {
    editorRef.current?.insertText(text);
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Main panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: CSS editor */}
        <div
          className={`flex flex-col border-r border-zinc-700 overflow-hidden ${
            cssCollapsed ? 'shrink-0 w-auto' : 'w-1/2'
          }`}
        >
          <button
            type="button"
            onClick={() => setCssCollapsed(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 border-b border-zinc-700 shrink-0 hover:text-zinc-200 transition-colors text-left"
          >
            <svg
              className={`w-3 h-3 transition-transform ${cssCollapsed ? '-rotate-90' : ''}`}
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            CSS
          </button>
          {!cssCollapsed && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border-b border-zinc-700 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowFontPicker(true)}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-100 transition-colors"
                  title="Search Google Fonts and insert @import"
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <circle cx="7" cy="7" r="4.5" />
                    <path d="M10.5 10.5l3 3" />
                  </svg>
                  Insert Font
                </button>
                <ScaleMenu onInsert={insertText} />
              </div>
              <div className="flex-1 overflow-hidden">
                <CssEditor
                  ref={editorRef}
                  value={cssText}
                  onChange={setCssText}
                />
              </div>
            </>
          )}
        </div>

        {/* Right: Markdown preview */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 border-b border-zinc-700 shrink-0">
            <span>Preview</span>
            <span className="text-zinc-500">
              Drop a .md file on the preview to load it
            </span>
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
