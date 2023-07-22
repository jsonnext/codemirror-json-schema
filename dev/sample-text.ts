import json5 from "json5";

export const json5Text = `{
  "name": "lexunicon",
  "version": "0.0.0",
  description: 'A lexicon for the unicon programming language',
  contributors: [
    {
      email: "email",
      "url": 'ht',
    }
  ],
  // ecmascript2042
  'type': '',
  exports: false
}`;

export const jsonText = JSON.stringify(json5.parse(json5Text), null, 2);
