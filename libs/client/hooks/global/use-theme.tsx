import { Theme } from "@taskboard/types";
import { useEffect, useState } from "react"
import Contextor from "../contextor";


export const useTheme = new Contextor(() => {
  const getLocalTheme = (): Theme | undefined => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith('theme' + "="))
      ?.split("=")[1] as Theme
  };

  const [theme, setTheme] = useState<Theme>(
    () => getLocalTheme() ?? 'light'
  )
  function set(theme: Theme) {
    document.cookie = `theme=${theme}; path=/; SameSite=true; secure`;
    setTheme(theme)
  }


  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return { set, currrent: theme }
})