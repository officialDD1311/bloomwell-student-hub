
import * as React from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = React.useState<Theme>(() => {
    // For SSR/tests where localStorage isn't available
    if (typeof window === "undefined") return "light";
    
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
