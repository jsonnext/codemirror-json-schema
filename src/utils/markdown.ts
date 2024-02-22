import markdownit from "markdown-it";
export function renderMarkdown(markdown: string) {
  return markdownit().renderInline(markdown);
}
