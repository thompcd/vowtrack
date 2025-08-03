'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function VotingButtons({ promiseId }: { promiseId: number }) {
  const [user, setUser] = useState<User | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserAndVote = async () => {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      // Check if user has already voted on this promise
      if (session?.user) {
        const { data: existingVote } = await supabase
          .from('promise_votes')
          .select('id')
          .eq('promise_id', promiseId)
          .eq('user_id', session.user.id)
          .single()

        setHasVoted(!!existingVote)
      }
      
      setLoading(false)
    }

    checkUserAndVote()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setHasVoted(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [promiseId])

  const handleVote = async (status: string) => {
    if (!user) {
      alert('Please sign in to vote!')
      return
    }

    setIsVoting(true)
    
    try {
      // Double-check if user already voted
      const { data: existingVote } = await supabase
        .from('promise_votes')
        .select('id')
        .eq('promise_id', promiseId)
        .eq('user_id', user.id)
        .single()

      if (existingVote) {
        alert('You have already voted on this promise!')
        setIsVoting(false)
        return
      }

      // Submit vote
      const { error } = await supabase
        .from('promise_votes')
        .insert({
          promise_id: promiseId,
          vote_status: status,
          user_id: user.id
        })

      if (error) throw error

      setHasVoted(true)
      // Refresh page to show updated results
      window.location.reload()
      
    } catch (error) {
      console.error('Error voting:', error)
      alert('Error submitting vote')
    }
    
    setIsVoting(false)
  }

  if (loading) {
    return (
      <div className="border-t pt-4">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="border-t pt-4">
        <p className="text-sm text-gray-600">Sign in to vote on promises</p>
      </div>
    )
  }

  if (hasVoted) {
    return (
      <div className="border-t pt-4">
        <p className="text-sm text-green-600">✓ You have voted on this promise</p>
      </div>
    )
  }

  return (
    <div className="border-t pt-4">
      <p className="text-sm text-gray-600 mb-2">What do you think?</p>
      <div className="flex gap-2 flex-wrap">
        <button 
          onClick={() => handleVote('Complete')}
          disabled={isVoting}
          className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
        >
          Complete
        </button>
        <button 
          onClick={() => handleVote('In Progress')}
          disabled={isVoting}
          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50"
        >
          In Progress
        </button>
        <button 
          onClick={() => handleVote('Broken')}
          disabled={isVoting}
          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
        >
          Broken
        </button>
        <button 
          onClick={() => handleVote('Not Started')}
          disabled={isVoting}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Not Started
        </button>
      </div>
    </div>
  )
}