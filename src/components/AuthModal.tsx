"use client"
import { useEffect, useRef, useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'

interface AuthModalProps {
  onClose: () => void
  initialEmail?: string
  enableTwitter?: boolean
  returnFocusRef?: React.RefObject<HTMLElement>
}

export default function AuthModal({ onClose, initialEmail = '', enableTwitter, returnFocusRef }: AuthModalProps) {
  const [email, setEmail] = useState(initialEmail)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const firstFieldRef = useRef<HTMLInputElement | null>(null)
  const previousActive = useRef<HTMLElement | null>(null)

  const close = () => {
    onClose()
    setTimeout(() => {
      const target = returnFocusRef?.current || previousActive.current
      target?.focus()
    }, 0)
  }

  // Focus management
  useEffect(() => {
    previousActive.current = document.activeElement as HTMLElement
    firstFieldRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'Tab') {
        const focusables = containerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusables || focusables.length === 0) return
        const list = Array.from(focusables)
        const idx = list.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey && (idx === 0 || document.activeElement === containerRef.current)) {
          e.preventDefault(); list[list.length - 1].focus();
        } else if (!e.shiftKey && idx === list.length - 1) {
          e.preventDefault(); list[0].focus();
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // close already defined above

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    setError(null)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    setSubmitting(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the secure sign-in link.')
      // Close after short delay to let user read message
      setTimeout(() => close(), 1200)
    }
  }

  const handleTwitter = async () => {
    setSubmitting(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'twitter', options: { redirectTo: window.location.origin } })
    setSubmitting(false)
    if (error) setError(error.message)
    else close() // will redirect
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md bg-surface border border-default rounded-xl shadow-xl p-6 animate-fade-in"
      >
        <div className="flex items-start justify-between mb-4">
          <h2 id="auth-modal-title" className="text-lg font-semibold text-primary">Sign In</h2>
          <button onClick={close} aria-label="Close" className="text-muted hover:text-primary rounded p-1 focus:outline-none focus:ring-2 focus:ring-brand-primary">✕</button>
        </div>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-xs font-semibold uppercase tracking-wide text-muted mb-1">Email</label>
            <input
              ref={firstFieldRef}
              id="auth-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-default bg-surface text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-primary text-white py-2.5 rounded text-sm font-medium hover:bg-brand-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Sending…' : 'Email me a link'}
          </button>
        </form>
        {enableTwitter && (
          <div className="mt-4">
            <button
              onClick={handleTwitter}
              disabled={submitting}
              className="w-full px-4 py-2 rounded border border-default text-sm text-secondary hover:text-primary hover:bg-neutral-50 transition-colors disabled:opacity-60"
            >
              Continue with X
            </button>
          </div>
        )}
        {error && <div className="mt-4 text-status-broken text-sm" role="alert">{error}</div>}
        {message && <div className="mt-4 text-status-complete text-sm" role="status">{message}</div>}
        <div className="mt-6 flex justify-end">
          <button
            onClick={close}
            type="button"
            className="px-4 py-2 rounded text-sm border border-default text-secondary hover:text-primary hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
