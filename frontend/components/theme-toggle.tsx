"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "system" : "system",
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    localStorage.setItem("theme", theme)
    if (theme === "system") {
      document.documentElement.classList.remove("dark")
      document.documentElement.style.colorScheme = "auto"
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.style.colorScheme = "dark"
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.style.colorScheme = "light"
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full bg-white p-2 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-yellow-500" />
      ) : (
        <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  )
}
