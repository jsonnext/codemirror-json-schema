// a little english-centric utility
// to join members of an array with commas and "or"
export const joinWithOr = (arr: string[], getPath?: (err: any) => any) => {
    const needsComma = arr.length > 2;
    let data = arr.map((err: any, i: number) => {
      const result = `\`` + (getPath ? JSON.stringify(getPath(err)) : err) + `\``;
      if (i === arr.length - 1) return "or " + result;
      return result;
    });
    if (needsComma) {
      return data.join(", ");
    }
    return data.join(" ");
  };
