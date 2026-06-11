import { getDemoSummary, getMvpModules } from "../../../packages/data/src/index.js";
import { attachDisclosure, attachThemeToggle } from "../../../packages/dom/src/index.js";

const root = document.documentElement;
const summary = document.querySelector("#summary");
const scopeList = document.querySelector("#scope-list");
const scopePanel = document.querySelector("#scope-panel");
const emptyPanel = document.querySelector("#empty-panel");
const scopeToggle = document.querySelector("#scope-toggle");
const scopeClose = document.querySelector("#scope-close");
const themeToggle = document.querySelector("#theme-toggle");

summary.innerHTML = getDemoSummary()
  .map(
    (item) => `
      <article class="metric">
        <span>${item.label}</span>
        <strong>${item.value}</strong>
      </article>
    `
  )
  .join("");

scopeList.textContent = getMvpModules().join(", ");

const disclosure = attachDisclosure({
  root: document.body,
  trigger: scopeToggle,
  target: scopePanel,
  close: scopeClose
});

disclosure.subscribe((isOpen) => {
  emptyPanel.hidden = isOpen;
});

attachThemeToggle({
  root,
  trigger: themeToggle
});
