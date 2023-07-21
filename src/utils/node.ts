import { SyntaxNode } from "@lezer/common";
import { COMPLEX_TYPES, TOKENS, PRIMITIVE_TYPES } from "../constants";
import { Text } from "@codemirror/state";

export const stripSurrondingQuotes = (str: string) => {
  return str.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
};

export const getWord = (
  doc: Text,
  node: SyntaxNode | null,
  stripQuotes = true
) => {
  const word = node ? doc.sliceString(node.from, node.to) : "";
  return stripQuotes ? stripSurrondingQuotes(word) : word;
};

export const isPrimitiveValueNode = (node: SyntaxNode) => {
  return (
    PRIMITIVE_TYPES.includes(node.name) ||
    (node.name === TOKENS.INVALID &&
      node.prevSibling?.name === TOKENS.PROPERTY_NAME)
  );
};

export const isValueNode = (node: SyntaxNode) => {
  return (
    [...PRIMITIVE_TYPES, ...COMPLEX_TYPES].includes(node.name) ||
    (node.name === TOKENS.INVALID &&
      node.prevSibling?.name === TOKENS.PROPERTY_NAME)
  );
};

export const isPropertyNameNode = (node: SyntaxNode) => {
  return (
    node.name === TOKENS.PROPERTY_NAME ||
    (node.name === TOKENS.INVALID &&
      node.prevSibling?.name === TOKENS.PROPERTY) ||
    "{"
  );
};

const getChildrenNodes = (node: SyntaxNode) => {
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

export const getChildValueNode = (node: SyntaxNode) => {
  return getChildrenNodes(node).find((n) => isPrimitiveValueNode(n));
};

const getArrayNodeChildren = (node: SyntaxNode) => {
  return getChildrenNodes(node).filter(
    (n) => PRIMITIVE_TYPES.includes(n.name) || COMPLEX_TYPES.includes(n.name)
  );
};
export const findNodeIndexInArrayNode = (
  arrayNode: SyntaxNode,
  valueNode: SyntaxNode
) => {
  return getArrayNodeChildren(arrayNode).findIndex(
    (nd) => nd.from === valueNode.from && nd.to === valueNode.to
  );
};
