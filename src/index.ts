import { serve } from 'bun';
import index from './index.html';

type FontEntry = {
  family: string;
  category: string;
  weights: string[];
};

// Cache the font list for the lifetime of the server process
let fontsCache: FontEntry[] | null = null;

const fetchGoogleFonts = async (): Promise<FontEntry[]> => {
  if (fontsCache) return fontsCache;

  const r = await fetch('https://fonts.google.com/metadata/fonts');
  if (!r.ok) throw new Error(`Google Fonts metadata fetch failed: ${r.status}`);

  const text = await r.text();
  // Response is prefixed with )]}' to prevent JSON hijacking
  const json = JSON.parse(text.replace(/^\)\]\}'\n?/, '')) as {
    familyMetadataList: Array<{
      family: string;
      category: string;
      fonts?: Record<string, unknown>;
    }>;
  };

  fontsCache = json.familyMetadataList.map(f => ({
    family: f.family,
    category: f.category,
    weights: Object.keys(f.fonts ?? {}),
  }));

  return fontsCache;
};

const server = serve({
  routes: {
    '/api/fonts': {
      async GET() {
        try {
          const fonts = await fetchGoogleFonts();
          return Response.json(fonts);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return Response.json({ error: msg }, { status: 502 });
        }
      },
    },

    // Serve index.html for all unmatched routes
    '/*': index,
  },

  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Typescale Editor running at ${server.url}`);
