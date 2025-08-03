'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function VotingButtons({ promiseId }: { promiseId: number }) {
  const [isVoting, setIsVoting] = useState(false)
  const [voted, setVoted] = useState(false)

  const handleVote = async (status: string) => {
    setIsVoting(true)
    
    try {
      // Generate unique ID for local testing
      const userIP = `user_${Date.now()}_${Math.random()}`
      
      // Check if user already voted (this won't work perfectly locally, but that's ok for testing)
      const { data: existingVote } = await supabase
        .from('promise_votes')
        .select('id')
        .eq('promise_id', promiseId)
        .eq('user_ip', userIP)
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
          user_ip: userIP
        })

      if (error) throw error

      setVoted(true)
      // Refresh page to show updated results
      window.location.reload()
      
    } catch (error) {
      console.error('Error voting:', error)
      alert('Error submitting vote')
    }
    
    setIsVoting(false)
  }

  if (voted) {
    return (
      <div className="border-t pt-4">
        <p className="text-sm text-green-600">✓ Thank you for voting!</p>
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