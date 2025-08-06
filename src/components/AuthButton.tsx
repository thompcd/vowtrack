'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSignInOptions, setShowSignInOptions] = useState(false)

  // Feature flag for Twitter login
  const twitterEnabled = process.env.NEXT_PUBLIC_ENABLE_TWITTER_LOGIN === 'true'

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

  const handleEmailSignIn = async () => {
    const email = prompt('Enter your email:')
    if (!email) return

    console.log('Attempting email sign in for:', email)
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) {
      console.error('Sign in error:', error)
      alert('Error: ' + error.message)
    } else {
      alert('Check your email for the login link!')
      setShowSignInOptions(false)
    }
  }

  const handleSocialSignIn = async (provider: 'twitter') => {
    console.log(`Attempting ${provider} sign in`)
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      console.error(`${provider} sign in error:`, error)
      alert(`Error signing in with ${provider}: ` + error.message)
    }
    
    setShowSignInOptions(false)
  }

  const handleSignOut = async () => {
    console.log('Signing out...')
    await supabase.auth.signOut()
    setShowSignInOptions(false)
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>
  }

  if (user) {
    const displayName = user.user_metadata?.full_name || 
                       user.user_metadata?.name || 
                       user.email || 
                       'User'
    
    const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture

    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {avatar && (
            <img 
              src={avatar} 
              alt="Avatar" 
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="text-sm text-gray-700 font-medium">
            {displayName}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-red-600 hover:underline"
        >
          Sign Out
        </button>
      </div>
    )
  }

  // Show sign in options - conditional Twitter button
  return (
    <div className="relative">
      {!showSignInOptions ? (
        <button
          onClick={() => setShowSignInOptions(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Sign In
        </button>
      ) : (
        <div className="absolute right-0 top-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-48 z-50">
          <div className="space-y-3">
            {/* Only show Twitter if feature flag is enabled */}
            {twitterEnabled && (
              <button
                onClick={() => handleSocialSignIn('twitter')}
                className="w-full flex items-center justify-center space-x-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
              >
                <span>𝕏</span>
                <span>Continue with X</span>
              </button>
            )}
            
            <button
              onClick={handleEmailSignIn}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              <span>✉️</span>
              <span>Continue with Email</span>
            </button>
            
            <button
              onClick={() => setShowSignInOptions(false)}
              className="w-full text-gray-500 text-sm hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}