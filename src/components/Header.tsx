import Link from 'next/link'
import Image from 'next/image'
import AuthButton from './AuthButton'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/images/logo.png" 
              alt="VowTrack Logo" 
              width={40} 
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold">VowTrack</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/politicians" className="text-gray-700 hover:text-blue-600">
              Politicians
            </Link>
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  )
}