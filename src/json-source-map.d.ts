declare module "json-source-map" {
  type Position = {
    line: number;
    column: number;
    pos: number;
  };

  type JSONPointer = {
    key: Position;
    keyEnd: Position;
    value: Position;
    valueEnd: Position;
  };

  type ParsedJSON = {
    data: unknown;
    pointers: {
      [key: string]: JSONPointer;
    };
  };

  function parse(json: string): ParsedJSON;
}
