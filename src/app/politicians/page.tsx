import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function Politicians() {
  console.log('Fetching politicians...')
  
  const { data: politicians, error } = await supabase
    .from('politicians')
    .select('*')
    .order('name')

  console.log('Politicians data:', politicians)
  console.log('Error:', error)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Politicians</h1>
        
        {/* Debug info */}
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          <p>Found {politicians?.length || 0} politicians</p>
          {error && <p className="text-red-600">Error: {error.message}</p>}
        </div>
        
        <div className="grid gap-4">
          {politicians?.map((politician) => (
            <div key={politician.id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{politician.name}</h2>
              <p className="text-gray-600">{politician.position}</p>
              {politician.party && (
                <p className="text-sm text-gray-500">{politician.party}</p>
              )}
              <Link 
                href={`/politicians/${politician.id}`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View Promises →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}