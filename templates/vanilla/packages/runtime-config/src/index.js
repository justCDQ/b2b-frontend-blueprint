export const defaultRuntimeConfig = {
  appName: "B2B Blueprint",
  apiBaseUrl: "",
  defaultLocale: "zh",
  defaultTheme: "system",
  density: "comfortable",
  enabledModules: ["users", "imports", "projects"],
  locales: ["zh", "en"],
  themeModes: ["light", "dark"]
};

export function createRuntimeConfig(config = {}) {
  const merged = {
    ...defaultRuntimeConfig,
    ...config
  };

  const locales = normalizeArray(merged.locales, defaultRuntimeConfig.locales);
  const themeModes = normalizeArray(merged.themeModes, defaultRuntimeConfig.themeModes);
  const enabledModules = normalizeArray(merged.enabledModules || merged.demoModules, defaultRuntimeConfig.enabledModules);
  const defaultLocale = locales.includes(merged.defaultLocale) ? merged.defaultLocale : locales[0];
  const defaultTheme = normalizeTheme(merged.defaultTheme, themeModes);

  return {
    ...merged,
    defaultLocale,
    defaultTheme,
    density: merged.density || defaultRuntimeConfig.density,
    enabledModules,
    locales,
    themeModes
  };
}

function normalizeArray(value, fallback) {
  if (!Array.isArray(value)) return [...fallback];
  const next = value.filter((item) => typeof item === "string" && item.trim());
  return next.length > 0 ? next : [...fallback];
}

function normalizeTheme(value, themeModes) {
  if (value === "system") return "system";
  return themeModes.includes(value) ? value : defaultRuntimeConfig.defaultTheme;
}
