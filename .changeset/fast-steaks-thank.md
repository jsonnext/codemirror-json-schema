---
"codemirror-json-schema": patch
---

fix nested json4 completion bug (#55)

- fix #54, expand properties inside nested objects as expected in json4
- always advance cursor after property completions
- add more test coverage
