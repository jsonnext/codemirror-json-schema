---
"codemirror-json-schema": patch
---

Fixed validation bugs: single objects incorrectly passed array schemas, invalid YAML caused errors after root-level change(now skipped if unparseable), and added tests ensuring non-array values(object, boolean, string, number) are correctly rejected.
