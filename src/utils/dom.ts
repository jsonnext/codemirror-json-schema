type Attributes = "class" | "text" | "id" | "role" | "aria-label" | "inner";

export function el(
  tagName: string,
  attributes: Partial<Record<Attributes, string>>,
  children: HTMLElement[] = []
) {
  const e = document.createElement(tagName);
  Object.entries(attributes).forEach(([k, v]) => {
    if (k === "text") {
      e.innerText = v;
      return;
    }
    if (k === "inner") {
      e.innerHTML = v;
      return;
    }
    e.setAttribute(k, v);
  });
  children.forEach((c) => e.appendChild(c));
  return e;
}
