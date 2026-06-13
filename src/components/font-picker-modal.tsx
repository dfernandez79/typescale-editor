import { useEffect, useRef, useState } from 'react';
import { type FontFamily, useFonts } from '../hooks/use-fonts';

type FontPickerModalProps = {
  onInsert: (css: string) => void;
  onClose: () => void;
};

const WEIGHT_LABELS: Record<string, string> = {
  '100': 'Thin',
  '200': 'ExtraLight',
  '300': 'Light',
  regular: 'Regular (400)',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black',
  italic: 'Italic',
};

const normalizeWeight = (w: string): string => {
  return w === 'regular' ? '400' : w === 'italic' ? '400i' : w;
};

export const FontPickerModal = ({
  onInsert,
  onClose,
}: FontPickerModalProps) => {
  const { data: fonts = [], isLoading: loading, error } = useFonts();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FontFamily | null>(null);
  const [selectedWeights, setSelectedWeights] = useState<Set<string>>(
    new Set(['400'])
  );
  const searchRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open as a native modal dialog and focus search
  useEffect(() => {
    dialogRef.current?.showModal();
    searchRef.current?.focus();
  }, []);

  const filtered = search.trim()
    ? fonts.filter(f => f.family.toLowerCase().includes(search.toLowerCase()))
    : fonts;

  const selectFont = (font: FontFamily) => {
    setSelected(font);
    // Default: pick "regular"/400 if available, else first weight
    const defaultWeight =
      font.weights.find(w => w === 'regular' || w === '400') ??
      font.weights[0] ??
      'regular';
    setSelectedWeights(new Set([normalizeWeight(defaultWeight ?? '400')]));
  };

  const toggleWeight = (w: string) => {
    const norm = normalizeWeight(w);
    setSelectedWeights(prev => {
      const next = new Set(prev);
      if (next.has(norm)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(norm);
      } else {
        next.add(norm);
      }
      return next;
    });
  };

  const buildSnippet = (): string => {
    if (!selected) return '';
    const familyParam = selected.family.replace(/ /g, '+');
    const weightsStr = Array.from(selectedWeights)
      .filter(w => !w.endsWith('i'))
      .sort()
      .join(';');
    const url = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weightsStr}&display=swap`;
    return `@import url('${url}');\n/* font-family: '${selected.family}', ${selected.category}; */`;
  };

  const handleInsert = () => {
    const snippet = buildSnippet();
    if (snippet) onInsert(snippet);
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onMouseDown={e => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="m-auto bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col p-0 backdrop:bg-black/60"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
        <h2 className="text-base font-semibold text-zinc-100">
          Insert Google Font
        </h2>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="text-zinc-400 hover:text-zinc-100 transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Search */}
      <div className="px-5 py-3 border-b border-zinc-700">
        <input
          ref={searchRef}
          type="search"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setSelected(null);
          }}
          placeholder="Search font families…"
          className="w-full bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Font list */}
      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        {loading && (
          <div className="py-8 text-center text-zinc-400 text-sm">
            Loading fonts…
          </div>
        )}
        {error && (
          <div className="py-8 text-center text-red-400 text-sm">
            Failed to load fonts: {error.message}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="py-8 text-center text-zinc-500 text-sm">
            No fonts match "{search}"
          </div>
        )}
        {!loading &&
          !error &&
          filtered.slice(0, 100).map(font => (
            <button
              type="button"
              key={font.family}
              onClick={() => selectFont(font)}
              className={`w-full text-left px-5 py-2.5 text-sm flex justify-between items-center transition-colors
                ${
                  selected?.family === font.family
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-200 hover:bg-zinc-800'
                }`}
            >
              <span className="font-medium">{font.family}</span>
              <span
                className={`text-xs ${selected?.family === font.family ? 'text-blue-200' : 'text-zinc-500'}`}
              >
                {font.category}
              </span>
            </button>
          ))}
        {!loading && !error && filtered.length > 100 && (
          <div className="py-2 text-center text-zinc-500 text-xs">
            Showing 100 of {filtered.length} — refine search to see more
          </div>
        )}
      </div>

      {/* Weight picker */}
      {selected && (
        <div className="px-5 py-3 border-t border-zinc-700 bg-zinc-850">
          <div className="text-xs text-zinc-400 mb-2 font-medium uppercase tracking-wide">
            Weights for {selected.family}
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.weights.map(w => {
              const norm = normalizeWeight(w);
              const label = WEIGHT_LABELS[w] ?? w;
              const active = selectedWeights.has(norm);
              return (
                <button
                  type="button"
                  key={w}
                  onClick={() => toggleWeight(w)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors
                      ${
                        active
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                      }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview snippet */}
      {selected && (
        <div className="px-5 py-3 border-t border-zinc-700">
          <pre className="text-xs text-zinc-300 bg-zinc-800 rounded p-2.5 overflow-x-auto">
            {buildSnippet()}
          </pre>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-2 px-5 py-4 border-t border-zinc-700">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="px-4 py-1.5 rounded text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleInsert}
          disabled={!selected}
          className="px-4 py-1.5 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Insert @import
        </button>
      </div>
    </dialog>
  );
};
