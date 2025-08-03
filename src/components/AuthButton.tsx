'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle auth state changes
    const handleAuthChange = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    // Check for auth tokens in URL hash (from magic link)
    const handleHashChange = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      if (accessToken && refreshToken) {
        console.log('Found tokens in URL, setting session...')
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (error) {
          console.error('Error setting session:', error)
        } else {
          console.log('Session set successfully:', data.user?.email)
          setUser(data.user)
          // Clean up the URL
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }
    }

    handleAuthChange()
    handleHashChange()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async () => {
    const email = prompt('Enter your email:')
    if (!email) return

    console.log('Attempting sign in for:', email)
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Don't use callback, just redirect to the same page
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) {
      console.error('Sign in error:', error)
      alert('Error: ' + error.message)
    } else {
      alert('Check your email for the login link!')
    }
  }

  const handleSignOut = async () => {
    console.log('Signing out...')
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700 font-medium">
          ✓ {user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="text-sm text-red-600 hover:underline"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
    >
      Sign In
    </button>
  )
}