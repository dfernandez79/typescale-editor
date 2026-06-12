export const SCALES: Record<string, number> = {
  "Minor Second": 1.067,
  "Major Second": 1.125,
  "Minor Third": 1.2,
  "Major Third": 1.25,
  "Perfect Fourth": 1.333,
  "Augmented Fourth": 1.414,
  "Perfect Fifth": 1.5,
  "Golden Ratio": 1.618,
};

const STEP_NAMES: Record<string, string> = {
  "-2": "xs",
  "-1": "sm",
  "0": "base",
  "1": "lg",
  "2": "xl",
  "3": "2xl",
  "4": "3xl",
  "5": "4xl",
  "6": "5xl",
};

export function generateScaleCss(
  name: string,
  ratio: number,
  base = 1,
  steps: [number, number] = [-2, 6]
): string {
  const [min, max] = steps;
  const lines: string[] = [
    `/* ${name} — ratio: ${ratio} */`,
    `:root {`,
    `  --type-ratio: ${ratio};`,
    `  --type-base: ${base}rem;`,
    ``,
  ];

  for (let i = min; i <= max; i++) {
    const value = base * Math.pow(ratio, i);
    const rem = value.toFixed(4).replace(/\.?0+$/, "");
    const alias = STEP_NAMES[i.toString()];
    const varName = alias ? `--type-${alias}` : `--type-step-${i}`;
    lines.push(`  ${varName}: ${rem}rem; /* step ${i >= 0 ? "+" : ""}${i} */`);
  }

  lines.push(`}`);
  return lines.join("\n");
}
