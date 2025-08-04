'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function AddPromise({ params }: { params: Promise<{ id: string }> }) {
  const [user, setUser] = useState<User | null>(null)
  const [politician, setPolitician] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [politicianId, setPoliticianId] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date_made: '',
    source_url: ''
  })
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const { id } = await params
      setPoliticianId(id)

      // Check if user is signed in
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      // Fetch politician
      const { data: politicianData } = await supabase
        .from('politicians')
        .select('*')
        .eq('id', id)
        .single()
      
      setPolitician(politicianData)
    }

    loadData()
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please sign in to add promises')
      return
    }

    if (!formData.title) {
      alert('Promise title is required')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('promises')
        .insert([{
          politician_id: parseInt(politicianId),
          title: formData.title,
          description: formData.description || null,
          date_made: formData.date_made || null,
          source_url: formData.source_url || null
        }])

      if (error) throw error

      alert('Promise added successfully!')
      router.push(`/politicians/${politicianId}`)
      
    } catch (error) {
      console.error('Error adding promise:', error)
      alert('Error adding promise')
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">You need to sign in to add promises.</p>
            <Link href={`/politicians/${politicianId}`} className="text-blue-600 hover:underline">
              ← Back to {politician?.name || 'Politician'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link href={`/politicians/${politicianId}`} className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to {politician?.name || 'Politician'}
        </Link>

        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-2">Add New Promise</h1>
          {politician && (
            <p className="text-gray-600 mb-6">for {politician.name}</p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promise Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Build 500 miles of new highway"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional details about the promise..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Made
              </label>
              <input
                type="date"
                value={formData.date_made}
                onChange={(e) => setFormData({...formData, date_made: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source URL
              </label>
              <input
                type="url"
                value={formData.source_url}
                onChange={(e) => setFormData({...formData, source_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/article"
              />
              <p className="text-sm text-gray-500 mt-1">
                Link to speech, interview, or article where the promise was made
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Promise'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}