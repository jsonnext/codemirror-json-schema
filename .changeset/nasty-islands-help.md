---
"codemirror-json-schema": minor
---

**Breaking Change**: replaces backticks with `<code>` blocks in hover and completion! This just seemed to make more sense.

- upgrade `json-schema-library` to the latest 8.x with patch fixes, remove "forked" pointer step logic
- after autocompleting a property, when there is empty value, provide full autocomplete options
- as noted in the breaking change notice, all psuedo-markdown backtick ``delimiters are replaced with`<code>`
