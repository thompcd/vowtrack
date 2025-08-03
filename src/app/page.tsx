import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Image 
            src="/images/vowtrack-logo.png" 
            alt="VowTrack Logo" 
            width={60} 
            height={60}
            className="rounded-full mr-4"
          />
          <h1 className="text-4xl font-bold text-gray-700">
            VowTrack
          </h1>
        </div>
        <p className="text-xl text-center text-gray-700">
          Tracking political promises and accountability
        </p>
        <p className="text-center mt-4 text-gray-500">
          Coming soon...
        </p>
      </div>
    </div>
  )
}