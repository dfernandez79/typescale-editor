import { useCallback, useEffect, useRef, useState } from 'react';
import { CssEditor, type CssEditorHandle } from './components/css-editor';
import { FontPickerModal } from './components/font-picker-modal';
import { PreviewPanel } from './components/preview-panel';
import { ScaleMenu } from './components/scale-menu';
import { DEFAULT_CSS, DEFAULT_MARKDOWN } from './lib/defaultContent';
import './index.css';

export const App = () => {
  const [cssText, setCssText] = useState(DEFAULT_CSS);
  const [markdownText, setMarkdownText] = useState(DEFAULT_MARKDOWN);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [cssCollapsed, setCssCollapsed] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const editorRef = useRef<CssEditorHandle>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const insertText = (text: string) => {
    editorRef.current?.insertText(text);
  };

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current || !panelsRef.current) return;
      const rect = panelsRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(80, Math.max(20, pct)));
    };
    const handleMouseUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Main panels */}
      <div ref={panelsRef} className="flex flex-1 overflow-hidden">
        {/* Left: CSS editor */}
        <div
          className={`flex flex-col border-r border-zinc-700 overflow-hidden ${
            cssCollapsed ? 'shrink-0 w-auto' : 'shrink-0'
          }`}
          style={cssCollapsed ? undefined : { width: `${leftWidth}%` }}
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

        {/* Resize handle */}
        {!cssCollapsed && (
          <button
            type="button"
            aria-label="Resize panels"
            onMouseDown={startResize}
            className={`group relative w-1.5 shrink-0 cursor-col-resize self-stretch border-0 p-0 transition-colors ${
              isDragging ? 'bg-blue-500' : 'bg-zinc-700 hover:bg-blue-500'
            }`}
          >
            {/* Wider invisible hit area + center grip */}
            <span className="absolute inset-y-0 -left-1 -right-1" />
            <span className="absolute left-1/2 top-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-500 group-hover:bg-blue-200" />
          </button>
        )}

        {/* Right: Markdown preview */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
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

      {/* Drag overlay: blocks iframe from swallowing mouse events while resizing */}
      {isDragging && <div className="fixed inset-0 z-50 cursor-col-resize" />}

      {/* Font picker modal */}
      {showFontPicker && (
        <FontPickerModal
          onInsert={insertText}
          onClose={() => setShowFontPicker(false)}
        />
      )}
    </div>
  );
};

export default App;
