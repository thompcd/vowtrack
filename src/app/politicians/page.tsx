import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default async function Politicians() {
  const { data: politicians } = await supabase
    .from('politicians')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl text-gray-800 font-bold mb-8">Politicians</h1>
        
        <div className="grid gap-4">
          {politicians?.map((politician) => (
            <div key={politician.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-4">
                {politician.image_url && (
                  <Image
                    src={politician.image_url}
                    alt={politician.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl text-gray-800 font-semibold">{politician.name}</h2>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}