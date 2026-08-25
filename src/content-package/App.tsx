import { useEffect, useState } from 'preact/hooks';

import './index.css';

interface SnykResult {
  /** Human-readable status text, e.g. "no known security issues" */
  label: string;
  /** CSS colour from the badge, e.g. "#4c1" (green) / "#e05d44" (red) */
  color: string;
  /** Link to the full Snyk report */
  url: string;
}

const SNYK_BASE = 'https://snyk.io/test/npm';

/** Fetch the Snyk badge SVG and extract the status text + colour. */
async function fetchSnykScore(pkg: string): Promise<SnykResult> {
  const url = `${SNYK_BASE}/${encodeURIComponent(pkg)}/badge.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Snyk fetch failed: ${res.status}`);
  const svg = await res.text();

  // SVG badge text is inside the last <text> element
  const textMatch = svg.match(/<text[^>]*>([^<]+)<\/text>/g);
  const label = textMatch ? textMatch[textMatch.length - 1].replace(/<[^>]+>/g, '') : 'unknown';

  // Extract fill colour from the right-hand <rect>
  const colorMatch = svg.match(/<rect[^>]*fill="([^"]+)"[^>]*>/g);
  const color =
    colorMatch
      ?.map((r) => r.match(/fill="([^"]+)"/)?.[1])
      .filter(Boolean)
      .pop() ?? '#9f9f9f';

  return { label, color, url: `${SNYK_BASE}/${encodeURIComponent(pkg)}` };
}

export function App() {
  const pkg = location.pathname.split('/package/')[1]?.replace(/\/+$/, '') ?? '';

  const [result, setResult] = useState<SnykResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pkg) return;
    let cancelled = false;
    fetchSnykScore(pkg).then(
      (r) => {
        if (!cancelled) setResult(r);
      },
      (err: unknown) => {
        if (!cancelled) setError((err as Error).message ?? 'Unknown error');
      },
    );
    return () => {
      cancelled = true;
    };
  }, [pkg]);

  if (error) {
    return (
      <div class='nice-npm-snyk nice-npm-snyk--error'>
        <span>Snyk security data unavailable</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div class='nice-npm-snyk nice-npm-snyk--loading'>
        <span>Loading Snyk security score…</span>
      </div>
    );
  }

  return (
    <div class='nice-npm-snyk'>
      <a
        class='nice-npm-snyk__link'
        href={result.url}
        target='_blank'
        rel='noopener noreferrer'
        style={{ borderColor: result.color }}
      >
        <span class='nice-npm-snyk__badge' style={{ background: result.color }}>
          Snyk
        </span>
        <span class='nice-npm-snyk__label'>{result.label}</span>
        <span class='nice-npm-snyk__arrow'>↗</span>
      </a>
    </div>
  );
}
