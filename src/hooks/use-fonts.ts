import { useQuery } from '@tanstack/react-query';

export interface FontFamily {
  family: string;
  category: string;
  weights: string[];
}

async function fetchFonts(): Promise<FontFamily[]> {
  const res = await fetch('/api/fonts');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<FontFamily[]>;
}

export function useFonts() {
  return useQuery({
    queryKey: ['fonts'],
    queryFn: fetchFonts,
  });
}
