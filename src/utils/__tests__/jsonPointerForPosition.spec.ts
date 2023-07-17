import { describe, it, expect } from "vitest";
import { json } from "@codemirror/lang-json";

import {jsonPointerForPosition} from '../jsonPointerForPosition'
import { EditorView } from "@codemirror/view";

const getPointer = (jsonString: string, pos: number) => {
    const view = new EditorView({ doc: jsonString, extensions: [json()] });
    return jsonPointerForPosition(view, pos, 1);
  };

describe('jsonPointerForPosition', () =>{
    it('should return full pointer path for a position', ()=>{
        expect(getPointer('{"object": { "foo": true }, "bar": 123}', 14)).toEqual('/object/foo')
    })
    it('should return full pointer path for a position for associative array', ()=>{
        expect(getPointer('[{"object": [{ "foo": true }], "bar": 123}]', 16)).toEqual('/0/object/0/foo')
    })
})
