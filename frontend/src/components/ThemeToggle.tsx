import {
  Moon,
  Sun
} from "lucide-react";

import {
  getTheme,
  setTheme,
} from "../store/themeStore";
import type {Theme} from "../store/themeStore";

import {
  useEffect,
  useState
} from "react";

export default function ThemeToggle() {

  const [theme, setCurrentTheme] =
    useState<Theme>("dark");

  useEffect(() => {
    setCurrentTheme(getTheme());
  }, []);

  function toggleTheme() {

    const newTheme: Theme =
      theme === "dark"
        ? "light"
        : "dark";

    setTheme(newTheme);
    setCurrentTheme(newTheme);
  }

  return (

    <button
      onClick={toggleTheme}
      className="
        rounded-xl
        border
        border-slate-700
        p-2
        transition
        hover:bg-slate-800
        dark:hover:bg-slate-800
        light:border-slate-300
        light:hover:bg-slate-100
      "
      aria-label="Toggle theme"
    >

      {theme === "dark" ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}

    </button>

  );
}