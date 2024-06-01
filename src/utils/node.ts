import { SyntaxNode } from "@lezer/common";
import { COMPLEX_TYPES, TOKENS, PRIMITIVE_TYPES, MODES } from "../constants";
import { EditorState, Text } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { JSONMode, Side } from "../types";
import { resolveTokenName } from "./json-pointers";

export const getNodeAtPosition = (
  state: EditorState,
  pos: number,
  side: Side = -1
) => {
  return syntaxTree(state).resolveInner(pos, side);
};

export const stripSurroundingQuotes = (str: string) => {
  return str.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
};
export const surroundingDoubleQuotesToSingle = (str: string) => {
  return str.replace(/^"(.*)"$/, "'$1'");
};

export const getWord = (
  doc: Text,
  node: SyntaxNode | null,
  stripQuotes = true,
  onlyEvenQuotes = true
) => {
  const word = node ? doc.sliceString(node.from, node.to) : "";
  if (!stripQuotes) {
    return word;
  }
  if (onlyEvenQuotes) {
    return stripSurroundingQuotes(word);
  }
  return word.replace(/(^["'])|(["']$)/g, "");
};

export const isInvalidValueNode = (node: SyntaxNode, mode: JSONMode) => {
  return (
    resolveTokenName(node.name, mode) === TOKENS.INVALID &&
    (resolveTokenName(node.prevSibling?.name ?? "", mode) ===
      TOKENS.PROPERTY_NAME ||
      resolveTokenName(node.prevSibling?.name ?? "", mode) ===
        TOKENS.PROPERTY_COLON)
  );
};

export const isPrimitiveValueNode = (node: SyntaxNode, mode: JSONMode) => {
  return (
    PRIMITIVE_TYPES.includes(resolveTokenName(node.name, mode) as any) ||
    isInvalidValueNode(node, mode)
  );
};

export const isValueNode = (node: SyntaxNode, mode: JSONMode) => {
  return (
    [...PRIMITIVE_TYPES, ...COMPLEX_TYPES].includes(
      resolveTokenName(node.name, mode) as any
    ) || isInvalidValueNode(node, mode)
  );
};

export const isPropertyNameNode = (node: SyntaxNode, mode: JSONMode) => {
  return (
    resolveTokenName(node.name, mode) === TOKENS.PROPERTY_NAME ||
    (resolveTokenName(node.name, mode) === TOKENS.INVALID &&
      (resolveTokenName(node.prevSibling?.name ?? "", mode) ===
        TOKENS.PROPERTY ||
        resolveTokenName(node.prevSibling?.name ?? "", mode) === "{")) ||
    // TODO: Can we make this work without checking for the mode?
    (mode === MODES.YAML &&
      resolveTokenName(node.parent?.name ?? "", mode) === TOKENS.OBJECT)
  );
};

export const getChildrenNodes = (node: SyntaxNode) => {
  const children = [];
  let child = node.firstChild;
  while (child) {
    if (child) {
      children.push(child);
    }
    child = child?.nextSibling;
  }

  return children;
};

export const getMatchingChildrenNodes = (
  node: SyntaxNode,
  nodeName: string,
  mode: JSONMode
) => {
  return getChildrenNodes(node).filter(
    (n) => resolveTokenName(n.name, mode) === nodeName
  );
};

export const getMatchingChildNode = (
  node: SyntaxNode,
  nodeName: string,
  mode: JSONMode
) => {
  return (
    getChildrenNodes(node).find(
      (n) => resolveTokenName(n.name, mode) === nodeName
    ) ?? null
  );
};

export const getChildValueNode = (node: SyntaxNode, mode: JSONMode) => {
  return getChildrenNodes(node).find((n) => isPrimitiveValueNode(n, mode));
};

const getArrayNodeChildren = (node: SyntaxNode, mode: JSONMode) => {
  return getChildrenNodes(node).filter(
    (n) =>
      PRIMITIVE_TYPES.includes(resolveTokenName(n.name, mode) as any) ||
      COMPLEX_TYPES.includes(resolveTokenName(n.name, mode) as any)
  );
};
export const findNodeIndexInArrayNode = (
  arrayNode: SyntaxNode,
  valueNode: SyntaxNode,
  mode: JSONMode
) => {
  return getArrayNodeChildren(arrayNode, mode).findIndex(
    (nd) => nd.from === valueNode.from && nd.to === valueNode.to
  );
};

export const getClosestNode = (
  node: SyntaxNode,
  nodeName: string,
  mode: JSONMode,
  depth = Infinity
) => {
  let n: SyntaxNode | null = node;
  while (n && depth > 0) {
    if (resolveTokenName(n.name, mode) === nodeName) {
      return n;
    }
    n = n.parent;
    depth--;
  }
  return null;
};
