import { useEffect, useRef, useState } from 'react';
import { generateScaleCss, SCALES } from '../lib/scales';

interface ScaleMenuProps {
  onInsert: (css: string) => void;
}

export function ScaleMenu({ onInsert }: ScaleMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function handlePick(name: string, ratio: number) {
    const snippet = generateScaleCss(name, ratio);
    onInsert(snippet);
    setOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-100 transition-colors"
        title="Insert CSS custom properties for a type scale"
      >
        <span>Insert Scale</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
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
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-52 rounded-md shadow-lg bg-zinc-800 border border-zinc-700 py-1">
          {Object.entries(SCALES).map(([name, ratio]) => (
            <button
              type="button"
              key={name}
              onClick={() => handlePick(name, ratio)}
              className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700 flex justify-between items-center"
            >
              <span>{name}</span>
              <span className="text-zinc-400 text-xs font-mono">{ratio}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
