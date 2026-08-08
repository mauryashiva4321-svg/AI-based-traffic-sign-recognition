export type Theme = "dark" | "light";

const THEME_KEY = "traffic_ai_theme";

export function getTheme(): Theme {
  const storedTheme = localStorage.getItem(
    THEME_KEY
  ) as Theme | null;

  return storedTheme || "dark";
}

export function setTheme(theme: Theme) {
  localStorage.setItem(
    THEME_KEY,
    theme
  );

  document.documentElement.classList.toggle(
    "dark",
    theme === "dark"
  );
}

export function initializeTheme() {
  const theme = getTheme();

  setTheme(theme);

  return theme;
}