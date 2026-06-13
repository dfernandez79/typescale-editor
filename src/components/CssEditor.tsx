import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
  EditorView,
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap,
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  foldKeymap,
} from "@codemirror/language";
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";

// Centered chevron fold marker (replaces default text glyphs that sit off-center)
function foldMarker(open: boolean): HTMLElement {
  const span = document.createElement("span");
  span.style.display = "flex";
  span.style.alignItems = "center";
  span.style.justifyContent = "center";
  span.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;transform:rotate(${
    open ? 0 : -90
  }deg)"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
  return span;
}

// codemirror's basicSetup, inlined so we can swap in a custom fold gutter marker
const basicSetup = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter({
    markerDOM: (open) => foldMarker(open),
  }),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),
];

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
            ".cm-foldGutter .cm-gutterElement": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 2px",
            },
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
