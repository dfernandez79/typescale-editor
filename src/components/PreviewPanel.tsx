import { useCallback, useEffect, useRef, useState } from "react";
import { marked } from "marked";

interface PreviewPanelProps {
  css: string;
  markdown: string;
  onMarkdownChange: (md: string) => void;
}

function buildSrcDoc(css: string, html: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${css}</style>
</head>
<body>${html}</body>
</html>`;
}

export function PreviewPanel({ css, markdown, onMarkdownChange }: PreviewPanelProps) {
  const [srcDoc, setSrcDoc] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced srcDoc update
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const html = marked.parse(markdown) as string;
      setSrcDoc(buildSrcDoc(css, html));
    }, 150);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [css, markdown]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = Array.from(e.dataTransfer.files).find((f) => {
        const name = f.name.toLowerCase();
        return (
          name.endsWith(".md") ||
          name.endsWith(".markdown") ||
          f.type === "text/markdown" ||
          f.type === "text/x-markdown"
        );
      });
      if (!file) return;
      const text = await file.text();
      onMarkdownChange(text);
    },
    [onMarkdownChange]
  );

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <iframe
        srcDoc={srcDoc}
        sandbox="allow-same-origin"
        title="Typography Preview"
        className="h-full w-full border-0"
        style={{ background: "#fff" }}
      />
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 border-2 border-blue-400 border-dashed pointer-events-none">
          <div className="bg-white rounded-lg px-6 py-4 shadow-lg text-center">
            <div className="text-2xl mb-1">📄</div>
            <div className="font-semibold text-blue-700">Drop Markdown file</div>
            <div className="text-sm text-blue-500">.md or .markdown</div>
          </div>
        </div>
      )}
    </div>
  );
}
