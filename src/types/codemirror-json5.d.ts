declare module "codemirror-json5" {
  import type { LanguageSupport, LRLanguage } from "@codemirror/language";
  import type { Extension } from "@codemirror/state";
  import type { LintSource } from "@codemirror/lint";

  export function json5(): LanguageSupport;
  export const json5Language: LRLanguage;
  export function json5ParseLinter(): LintSource;
  export default json5;
}
