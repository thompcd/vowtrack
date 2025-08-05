'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function AddPolitician() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    party: '',
    image_url: ''
  })
  const router = useRouter()

  useEffect(() => {
    // Check if user is signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please sign in to add politicians')
      return
    }

    if (!formData.name || !formData.position) {
      alert('Name and position are required')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('politicians')
        .insert([{
          name: formData.name,
          position: formData.position,
          party: formData.party || null,
          image_url: formData.image_url || null
        }])
        .select()
        .single()

      if (error) throw error

      alert(`${formData.name} added successfully!`)
      router.push(`/politicians/${data.id}`)
      
    } catch (error: any) {
  console.error('Error adding politician:', error)
  if (error.message?.includes('new row violates row-level security')) {
    alert('You must be signed in to add politicians')
  } else {
    alert('Error adding politician: ' + (error.message || 'Unknown error'))
  }
}

    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">You need to sign in to add new politicians.</p>
            <Link href="/politicians" className="text-blue-600 hover:underline">
              ← Back to Politicians
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/politicians" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Politicians
        </Link>

        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Add New Politician</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Joe Biden"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., President of the United States"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Party
              </label>
              <select
                value={formData.party}
                onChange={(e) => setFormData({...formData, party: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select party (optional)</option>
                <option value="Democrat">Democrat</option>
                <option value="Republican">Republican</option>
                <option value="Independent">Independent</option>
                <option value="Green">Green</option>
                <option value="Libertarian">Libertarian</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Optional: Link to a public photo of the politician
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Politician'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}