import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";

export interface CssEditorHandle {
  insertText: (text: string) => void;
}

interface CssEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CssEditor = forwardRef<CssEditorHandle, CssEditorProps>(
  function CssEditor({ value, onChange }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    // Track whether the editor is the source of the current change
    const isInternalChange = useRef(false);

    // Expose insertText to parent
    useImperativeHandle(ref, () => ({
      insertText(text: string) {
        const view = viewRef.current;
        if (!view) return;
        const { state } = view;
        const selection = state.selection.main;
        // Insert at cursor; if at end of doc, prepend newline
        const atEnd = selection.from === state.doc.length;
        const insertValue = atEnd ? `\n\n${text}` : text;
        view.dispatch({
          changes: {
            from: atEnd ? state.doc.length : selection.from,
            to: atEnd ? state.doc.length : selection.to,
            insert: insertValue,
          },
          selection: {
            anchor:
              (atEnd ? state.doc.length : selection.from) + insertValue.length,
          },
        });
        view.focus();
      },
    }));

    // Create editor once
    useEffect(() => {
      if (!containerRef.current) return;

      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          isInternalChange.current = true;
          onChange(update.state.doc.toString());
          isInternalChange.current = false;
        }
      });

      const state = EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          css(),
          oneDark,
          updateListener,
          EditorView.theme({
            "&": { height: "100%", fontSize: "13px" },
            ".cm-scroller": {
              overflow: "auto",
              fontFamily: "'Menlo', 'Consolas', monospace",
            },
            ".cm-focused": { outline: "none" },
          }),
        ],
      });

      const view = new EditorView({ state, parent: containerRef.current });
      viewRef.current = view;

      return () => {
        view.destroy();
        viewRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync external value changes (e.g. scale insertion from outside) without feedback loop
    useEffect(() => {
      const view = viewRef.current;
      if (!view || isInternalChange.current) return;
      const current = view.state.doc.toString();
      if (current !== value) {
        view.dispatch({
          changes: { from: 0, to: current.length, insert: value },
        });
      }
    }, [value]);

    return (
      <div
        ref={containerRef}
        className="h-full w-full overflow-hidden"
        style={{ minHeight: 0 }}
      />
    );
  },
);
