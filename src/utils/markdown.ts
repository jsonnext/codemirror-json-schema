import md from "markdown-it";
import shiki from "@shikijs/markdown-it";

// const defaultPlugins = [
//   "markdown-it-abbr",
//   "markdown-it-deflist",
//   "markdown-it-emoji",
//   "markdown-it-footnote",
//   "markdown-it-ins",
//   "markdown-it-mark",
//   "markdown-it-sub",
//   "markdown-it-sup",
//   "markdown-it-task-lists",
//   "markdown-it-toc",
//   "markdown-it-attrs",
//   "markdown-it-katex",
//   "markdown-it-external-links",
//   "markdown-it-table-of-contents",
//   "markdown-it-anchor",
//   "markdown-it-implicit-figures",
//   "markdown-it-video",
//   "markdown-it-highlightjs",
// ];

const renderer = md({
  linkify: true,
  typographer: true,
});

renderer.use(
  await shiki({
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
  })
);

export function renderMarkdown(markdown: string, inline: boolean = true) {
  if (!inline) return renderer.render(markdown);
  return renderer.renderInline(markdown);
}
