'use client'

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const currentTheme = themes.find(t => t.value === theme) || themes[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-surface border border-default rounded-lg hover:bg-neutral-50 transition-colors"
      >
        <span>{currentTheme.emoji}</span>
        <span className="text-secondary">{currentTheme.label}</span>
        <span className="text-muted">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-surface border border-default rounded-lg shadow-lg py-2 min-w-48 z-50">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => {
                setTheme(themeOption.value)
                setIsOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                theme === themeOption.value ? 'bg-brand-primary text-white' : 'text-secondary'
              }`}
            >
              <span>{themeOption.emoji}</span>
              <span>{themeOption.label}</span>
              {theme === themeOption.value && (
                <span className="ml-auto">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}