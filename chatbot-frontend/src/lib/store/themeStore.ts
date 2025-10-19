import { create } from "zustand";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "light",
  setMode: (mode) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", mode);
      document.documentElement.dataset.theme = mode;
    }
    set({ mode });
  },
  toggleMode: () =>
    set((state) => {
      const next = state.mode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", next);
        document.documentElement.dataset.theme = next;
      }
      return { mode: next };
    }),
}));
