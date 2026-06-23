import { createDisclosure } from "../../headless/src/index.js";

export function attachDisclosure({ root, trigger, target, close }) {
  const disclosure = createDisclosure(false);

  disclosure.subscribe((isOpen) => {
    target.hidden = !isOpen;
    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  trigger.addEventListener("click", () => disclosure.toggle());
  close?.addEventListener("click", () => disclosure.close());

  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      disclosure.close();
    }
  });

  return disclosure;
}

export function attachThemeToggle({ root, trigger }) {
  trigger.addEventListener("click", () => {
    const current = root.dataset.theme === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    trigger.textContent = `Switch to ${current}`;
  });
}
