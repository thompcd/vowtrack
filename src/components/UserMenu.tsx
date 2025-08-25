"use client"
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
// Removed ThemeSelector dropdown; using ThemeModeToggle instead
import ThemeModeToggle from './ThemeModeToggle'
import Image from 'next/image'
import AuthModal from './AuthModal'

interface UserMeta {
  full_name?: string
  name?: string
  avatar_url?: string
  picture?: string
}

export default function UserMenu() {
  const [user, setUser] = useState<{ id: string; email?: string | null; user_metadata: UserMeta } | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const twitterEnabled = process.env.NEXT_PUBLIC_ENABLE_TWITTER_LOGIN === 'true'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    const clickHandler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('mousedown', clickHandler)
    return () => { subscription.unsubscribe(); window.removeEventListener('mousedown', clickHandler) }
  }, [])

  const [authOpen, setAuthOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setOpen(false)
  }

  if (loading) {
    return <div className="text-xs text-muted">Loading...</div>
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setAuthOpen(true)}
          className="bg-brand-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-brand-primary-hover transition-colors"
        >
          Sign In
        </button>
        {authOpen && (
          <AuthModal
            onClose={() => setAuthOpen(false)}
            enableTwitter={twitterEnabled}
          />
        )}
      </>
    )
  }

  const displayName = user.user_metadata.full_name || user.user_metadata.name || user.email || 'User'
  const avatar = user.user_metadata.avatar_url || user.user_metadata.picture || '/images/avatar-placeholder.svg'
  const initials = displayName.split(/\s+/).slice(0,2).map(p=>p[0]).join('').toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-10 h-10 rounded-full border border-default flex items-center justify-center bg-surface overflow-hidden hover:shadow focus:outline-none focus:ring-2 focus:ring-brand-primary"
      >
        {avatar ? (
          <Image src={avatar} alt={displayName} width={40} height={40} className="object-cover" />
        ) : (
          <span className="text-sm font-semibold text-primary">{initials}</span>
        )}
      </button>
  {open && (
        <div
          className="absolute right-0 mt-2 w-72 bg-surface border border-default rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in"
          role="menu"
        >
          <div className="p-4 border-b border-default flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-default flex items-center justify-center bg-neutral-100 overflow-hidden">
              {avatar ? <Image src={avatar} alt={displayName} width={48} height={48} className="object-cover" /> : <span className="text-sm font-semibold text-primary">{initials}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-primary text-sm font-medium truncate">{displayName}</p>
              {user.email && <p className="text-muted text-xs truncate">{user.email}</p>}
            </div>
          </div>
          <div className="relative p-4 space-y-4 pb-16 max-h-[50vh] overflow-y-auto">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 rounded bg-status-broken/40 text-status-broken hover:bg-status-broken/60 text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
            <ThemeModeToggle className="absolute bottom-3 right-3" />
          </div>
        </div>
      )}
      {authOpen && !open && (
        <AuthModal onClose={() => setAuthOpen(false)} enableTwitter={twitterEnabled} />
      )}
    </div>
  )
}
