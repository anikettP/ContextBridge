/**
 * Universal high-fidelity helper to paste text into modern web app input elements
 * (React textareas, ProseMirror contenteditables, Lexical, Draft.js, etc.)
 */
export function pasteTextIntoElement(element: HTMLElement, text: string): boolean {
  element.focus();

  // 1. Try document.execCommand("insertText") (works natively for ProseMirror, Lexical, & contenteditable)
  try {
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    if (document.execCommand("insertText", false, text)) {
      dispatchInputEvents(element);
      return true;
    }
  } catch {}

  // 2. Try native HTMLTextAreaElement value descriptor setter (works for React textareas)
  if ("value" in element) {
    try {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(element, text);
      } else {
        (element as HTMLTextAreaElement).value = text;
      }
      dispatchInputEvents(element);
      return true;
    } catch {}
  }

  // 3. Try ClipboardEvent paste simulation
  try {
    const dataTransfer = new DataTransfer();
    dataTransfer.setData("text/plain", text);
    const pasteEvent = new ClipboardEvent("paste", {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(pasteEvent);
  } catch {}

  // 4. Direct DOM fallback
  if ("value" in element) {
    (element as HTMLTextAreaElement).value = text;
  } else {
    element.innerText = text;
  }

  dispatchInputEvents(element);
  return true;
}

function dispatchInputEvents(element: HTMLElement): void {
  element.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
  element.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
  element.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true }));
  element.dispatchEvent(new KeyboardEvent("keyup", { key: "a", bubbles: true }));
}
