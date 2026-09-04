// src/components/docs/CodeBlock.tsx
"use client";

import { useState, useMemo } from "react";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = {
  code: string;
  language?: string;
  title?: string;
};

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function replaceOutsidePlaceholders(
  str: string,
  regex: RegExp,
  replacer: (match: string, ...groups: string[]) => string,
): string {
  const phRe = /\u0000H\d+\u0000/g;
  const segments: Array<{ text: string; isPh: boolean }> = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = phRe.exec(str)) !== null) {
    segments.push({ text: str.slice(last, m.index), isPh: false });
    segments.push({ text: m[0], isPh: true });
    last = m.index + m[0].length;
  }
  segments.push({ text: str.slice(last), isPh: false });

  const flags = regex.flags.includes("g") ? regex.flags : `${regex.flags}g`;
  return segments
    .map((seg) => {
      if (seg.isPh) return seg.text;
      const re = new RegExp(regex.source, flags);
      return seg.text.replace(re, replacer as unknown as string);
    })
    .join("");
}

function highlight(code: string, lang: string): string {
  const l = lang.toLowerCase();
  let html = escapeHtml(code);
  const placeholders: string[] = [];
  const ph = (i: number) => `\u0000H${i}\u0000`;

  if (l === "text" || l === "txt") {
    return html;
  }

  if (l === "bash" || l === "shell" || l === "sh") {
    const combined = /#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/gm;
    let idx = 0;
    html = html.replace(combined, (match) => {
      const cls = match.startsWith("#") ? "text-muted-foreground/60 italic" : "text-success";
      const token = ph(idx);
      placeholders[idx] = `<span class="${cls}">${match}</span>`;
      idx++;
      return token;
    });

    html = replaceOutsidePlaceholders(html, /(--[\w-]+)/, (_m, g1) => `<span class="text-info">${g1}</span>`);
    html = replaceOutsidePlaceholders(html, /\b(npm|pnpm|yarn|npx|tsc|node|git)\b/, (_m, g1) => `<span class="text-primary">${g1}</span>`);

    placeholders.forEach((rep, i) => {
      html = html.split(ph(i)).join(rep);
    });
    return html;
  }

  if (l === "json") {
    let idx = 0;
    // Keys: "key":
    html = html.replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, (_m, p1: string, p2: string) => {
      const token = ph(idx);
      placeholders[idx] = `<span class="text-primary">${p1}</span>`;
      idx++;
      return token + p2;
    });
    // Remaining strings are values
    html = html.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
      const token = ph(idx);
      placeholders[idx] = `<span class="text-success">${match}</span>`;
      idx++;
      return token;
    });

    html = replaceOutsidePlaceholders(html, /\b(true|false|null)\b/, (_m, g1) => `<span class="text-info">${g1}</span>`);
    html = replaceOutsidePlaceholders(html, /:\s*(-?\d+\.?\d*)/, (_m, g1) => `: <span class="text-warning">${g1}</span>`);

    placeholders.forEach((rep, i) => {
      html = html.split(ph(i)).join(rep);
    });
    return html;
  }

  // TypeScript / JavaScript (default)
  {
    const combined = /\/\/.*$|\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/gm;
    let idx = 0;
    html = html.replace(combined, (match) => {
      const isComment = match.startsWith("//") || match.startsWith("/*");
      const cls = isComment ? "text-muted-foreground/60 italic" : "text-success";
      const token = ph(idx);
      placeholders[idx] = `<span class="${cls}">${match}</span>`;
      idx++;
      return token;
    });

    html = replaceOutsidePlaceholders(
      html,
      /\b(import|from|const|let|var|async|await|new|if|else|try|catch|instanceof|return|export|default|class|extends|implements|interface|type|function|for|while|switch|case|break|throw|of|in|as)\b/,
      (_m, g1) => `<span class="text-primary">${g1}</span>`,
    );
    html = replaceOutsidePlaceholders(
      html,
      /\b(string|number|boolean|void|Promise|Error|DelokError|DelokConfigurationError|DelokNetworkError|DelokTimeoutError|DelokHttpError)\b/,
      (_m, g1) => `<span class="text-info">${g1}</span>`,
    );
    html = replaceOutsidePlaceholders(html, /\b(\d+\.?\d*)\b/, (_m, g1) => `<span class="text-warning">${g1}</span>`);

    placeholders.forEach((rep, i) => {
      html = html.split(ph(i)).join(rep);
    });
    return html;
  }
}

export function CodeBlock({ code, language = "bash", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => highlight(code, language), [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-background/50 px-3 py-2">
        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {title ?? language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          {copied ? (
            <Check className="h-3 w-3 text-success" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code
          className="text-foreground"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
