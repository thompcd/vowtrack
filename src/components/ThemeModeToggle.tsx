"use client"
import { useTheme } from '@/context/ThemeContext'
import { useCallback } from 'react'

interface ThemeModeToggleProps {
  className?: string
}

export default function ThemeModeToggle({ className = '' }: ThemeModeToggleProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  const toggle = useCallback(() => {
    setTheme(isDark ? 'default' : 'dark')
  }, [isDark, setTheme])

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={`w-10 h-10 rounded-full border border-default bg-surface flex items-center justify-center shadow-sm hover:shadow transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-primary ${className}`}
    >
      {isDark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
          <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
