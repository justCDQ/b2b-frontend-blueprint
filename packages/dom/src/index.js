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

export function attachThemeController({
  root,
  trigger,
  defaultTheme = "system",
  density = "comfortable",
  storageKey = "b2b-blueprint-theme",
  labels = {
    light: "Switch to light",
    dark: "Switch to dark"
  }
}) {
  const storedTheme = readStorage(storageKey);
  let theme = normalizeTheme(storedTheme || defaultTheme);

  function apply() {
    const resolvedTheme = resolveTheme(theme);
    root.dataset.theme = resolvedTheme;
    root.dataset.themePreference = theme;
    root.dataset.density = density;
    trigger.textContent = resolvedTheme === "dark" ? labels.light : labels.dark;
  }

  trigger.addEventListener("click", () => {
    theme = resolveTheme(theme) === "dark" ? "light" : "dark";
    writeStorage(storageKey, theme);
    apply();
  });

  apply();

  return {
    getTheme() {
      return theme;
    },
    setTheme(nextTheme) {
      theme = normalizeTheme(nextTheme);
      writeStorage(storageKey, theme);
      apply();
    }
  };
}

export const attachThemeToggle = attachThemeController;

function normalizeTheme(value) {
  return ["light", "dark", "system"].includes(value) ? value : "system";
}

function resolveTheme(value) {
  if (value === "system") {
    return prefersDark() ? "dark" : "light";
  }

  return value;
}

function prefersDark() {
  return Boolean(globalThis.matchMedia?.("(prefers-color-scheme: dark)")?.matches);
}

function readStorage(key) {
  try {
    return globalThis.localStorage?.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    // Storage may be unavailable in restricted browser contexts.
  }
}
