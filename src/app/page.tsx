import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-page py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Image 
            src="/images/logo.png" 
            alt="VowTrack Logo" 
            width={60} 
            height={60}
            className="rounded-full mr-4"
          />
          <h1 className="text-4xl font-bold text-primary">
            VowTrack
          </h1>
        </div>
        <p className="text-xl text-center text-secondary mb-8">
          Tracking political promises and accountability
        </p>
        
        <div className="text-center">
          <Link 
            href="/politicians"
            className="bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-primary-hover inline-block transition-colors"
          >
            Browse Politicians
          </Link>
        </div>
      </div>
    </div>
  )
}