import { useQuery } from '@tanstack/react-query';

export type FontFamily = {
  family: string;
  category: string;
  weights: string[];
};

const fetchFonts = async (): Promise<FontFamily[]> => {
  const res = await fetch('/api/fonts');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<FontFamily[]>;
};

export const useFonts = () => {
  return useQuery({
    queryKey: ['fonts'],
    queryFn: fetchFonts,
  });
};
