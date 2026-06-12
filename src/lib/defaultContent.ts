export const DEFAULT_CSS = `/* Typography Scale — Major Third (1.25) */
:root {
  --type-ratio: 1.25;
  --type-base: 1rem;

  --type-xs:   0.64rem;   /* step -2 */
  --type-sm:   0.8rem;    /* step -1 */
  --type-base: 1rem;      /* step  0 */
  --type-lg:   1.25rem;   /* step +1 */
  --type-xl:   1.5625rem; /* step +2 */
  --type-2xl:  1.9531rem; /* step +3 */
  --type-3xl:  2.4414rem; /* step +4 */
  --type-4xl:  3.0518rem; /* step +5 */
  --type-5xl:  3.8147rem; /* step +6 */

  --font-body: Georgia, "Times New Roman", serif;
  --font-heading: system-ui, sans-serif;
  --font-mono: "Courier New", Courier, monospace;

  --color-text: #1a1a1a;
  --color-muted: #555;
  --color-code-bg: #f4f4f4;
  --color-border: #ddd;

  --line-height-body: 1.6;
  --line-height-heading: 1.15;
  --measure: 68ch;
}

/* Base reset */
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  font-size: var(--type-base);
  line-height: var(--line-height-body);
  color: var(--color-text);
  background: #fff;
  max-width: var(--measure);
  margin: 3rem auto;
  padding: 0 1.5rem 4rem;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: var(--line-height-heading);
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 700;
}

h1 { font-size: var(--type-5xl); }
h2 { font-size: var(--type-4xl); }
h3 { font-size: var(--type-3xl); }
h4 { font-size: var(--type-2xl); }
h5 { font-size: var(--type-xl); }
h6 { font-size: var(--type-lg); }

/* Body text */
p {
  margin-top: 0;
  margin-bottom: 1em;
}

/* Lists */
ul, ol {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

li {
  margin-bottom: 0.25em;
}

/* Links */
a {
  color: #0066cc;
}

a:hover {
  color: #004499;
}

/* Code */
code {
  font-family: var(--font-mono);
  font-size: var(--type-sm);
  background: var(--color-code-bg);
  padding: 0.15em 0.4em;
  border-radius: 3px;
}

pre {
  font-family: var(--font-mono);
  font-size: var(--type-sm);
  background: var(--color-code-bg);
  padding: 1em 1.25em;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 1em;
}

pre code {
  background: none;
  padding: 0;
}

/* Blockquote */
blockquote {
  border-left: 3px solid var(--color-border);
  margin: 1em 0;
  padding: 0.25em 0 0.25em 1.25em;
  color: var(--color-muted);
  font-style: italic;
}

/* Horizontal rule */
hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 2em 0;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
  font-size: var(--type-sm);
}

th, td {
  border: 1px solid var(--color-border);
  padding: 0.5em 0.75em;
  text-align: left;
}

th {
  background: var(--color-code-bg);
  font-weight: 600;
}

/* Small text */
small {
  font-size: var(--type-xs);
}
`;

export const DEFAULT_MARKDOWN = `# Typography Scale Editor

A tool for building and previewing modular type scales. Edit the CSS on the left — changes reflect here instantly.

## What is a type scale?

A **type scale** is a set of font sizes derived from a base size and a ratio. Instead of choosing sizes arbitrarily, each step multiplies or divides the previous by the ratio.

The current scale uses the **Major Third** ratio (×1.25):

| Step | Variable | Size |
|------|----------|------|
| +5   | \`--type-5xl\` | 3.81 rem |
| +4   | \`--type-4xl\` | 3.05 rem |
| +3   | \`--type-3xl\` | 2.44 rem |
| +2   | \`--type-2xl\` | 1.95 rem |
| +1   | \`--type-lg\`  | 1.25 rem |
|  0   | \`--type-base\`| 1.00 rem |
| −1   | \`--type-sm\`  | 0.80 rem |
| −2   | \`--type-xs\`  | 0.64 rem |

## Common ratios

- **Minor Second** — 1.067 — very tight
- **Major Second** — 1.125 — subtle
- **Minor Third** — 1.200 — gentle
- **Major Third** — 1.250 — comfortable *(current)*
- **Perfect Fourth** — 1.333 — classic
- **Golden Ratio** — 1.618 — dramatic

## How to use this editor

1. Use **Insert Scale** to swap the custom property block for a different ratio.
2. Use **Insert Font** to search Google Fonts and add an \`@import\` declaration.
3. Reference the custom properties in your CSS rules:

\`\`\`css
h1 { font-size: var(--type-5xl); }
p  { font-size: var(--type-base); }
\`\`\`

4. Drag and drop any \`.md\` file onto this panel to preview your own content.

---

## Text samples

### Headings scale in action

# Heading 1 — 5xl
## Heading 2 — 4xl
### Heading 3 — 3xl
#### Heading 4 — 2xl
##### Heading 5 — xl
###### Heading 6 — lg

---

### Body paragraph

The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing.

> Good typography is invisible. It guides the reader's eye without drawing attention to itself.

### Inline code and monospace

Reference a scale step with \`var(--type-xl)\` in your CSS. Full blocks:

\`\`\`css
body {
  font-size: var(--type-base);
  line-height: 1.6;
  font-family: var(--font-body);
}
\`\`\`

### Lists

**Unordered:**

- Legibility over decoration
- Consistent vertical rhythm
- Harmonious size relationships
- Appropriate measure (line length)

**Ordered:**

1. Choose a base font size
2. Pick a scale ratio
3. Apply the variables to your elements
4. Adjust line-height and spacing
5. Test with real content

---

*Small text uses \`--type-xs\` (0.64 rem).* Regular text uses \`--type-base\` (1 rem).
`;
