import { readFileSync, writeFileSync } from 'fs';
import { marked } from 'marked';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const md = readFileSync(join(__dirname, 'agentic-migration-ux-spec.md'), 'utf-8');
const html = await marked.parse(md);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Agentic Migration UX Specification</title>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"><\/script>
<style>
  @page { margin: 1.5cm; size: A4; }
  @media print {
    body { font-size: 11pt; }
    h1 { page-break-before: avoid; }
    h2 { page-break-before: always; }
    h2:first-of-type { page-break-before: avoid; }
    table, pre, .mermaid { page-break-inside: avoid; }
  }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  h1 {
    font-size: 28px;
    border-bottom: 3px solid #0066cc;
    padding-bottom: 10px;
    margin-bottom: 30px;
    color: #0066cc;
  }
  h2 {
    font-size: 22px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 8px;
    margin-top: 40px;
    color: #333;
  }
  h3 {
    font-size: 18px;
    margin-top: 30px;
    color: #444;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
    font-size: 14px;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 10px 12px;
    text-align: left;
  }
  th {
    background-color: #f0f4f8;
    font-weight: 600;
    color: #333;
  }
  tr:nth-child(even) { background-color: #fafbfc; }
  code {
    background-color: #f0f4f8;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 13px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  }
  pre {
    background-color: #f6f8fa;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.5;
  }
  pre code {
    background: none;
    padding: 0;
  }
  blockquote {
    border-left: 4px solid #0066cc;
    margin: 16px 0;
    padding: 8px 16px;
    color: #555;
    background-color: #f8f9fa;
  }
  hr {
    border: none;
    border-top: 2px solid #e1e4e8;
    margin: 40px 0;
  }
  ul, ol { padding-left: 24px; }
  li { margin: 4px 0; }
  strong { color: #111; }
  a { color: #0066cc; text-decoration: none; }
  .mermaid {
    text-align: center;
    margin: 24px 0;
    padding: 16px;
    background: #fafbfc;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
  }
</style>
</head>
<body>
${html}
<script>
document.querySelectorAll('pre code.language-mermaid').forEach(block => {
  const pre = block.parentElement;
  const div = document.createElement('div');
  div.className = 'mermaid';
  div.textContent = block.textContent;
  pre.replaceWith(div);
});
mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
<\/script>
</body>
</html>`;

const outPath = join(__dirname, 'agentic-migration-ux-spec.html');
writeFileSync(outPath, fullHtml);
console.log('HTML written to:', outPath);
