'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'default' | 'green' | 'purple' | 'red' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void  // Changed from -> to =>
  themes: { value: Theme; label: string; emoji: string }[]
}

// Move themes declaration before it's used in the interface
export const themes = [
  { value: 'default' as Theme, label: 'Default Blue', emoji: '🔵' },
  { value: 'green' as Theme, label: 'Green Focus', emoji: '🟢' },
  { value: 'purple' as Theme, label: 'Purple Power', emoji: '🟣' },
  { value: 'red' as Theme, label: 'Red Alert', emoji: '🔴' },
  { value: 'dark' as Theme, label: 'Dark Mode', emoji: '🌙' },
]

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('default')

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('vowtrack-theme') as Theme
    if (savedTheme && themes.some(t => t.value === savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('vowtrack-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}