import Link from 'next/link'
import Image from 'next/image'
import AuthButton from './AuthButton'
import ThemeSelector from './ThemeSelector'

export default function Header() {
  return (
    <header className="bg-surface shadow-sm border-b border-default">
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
            <span className="text-xl font-bold text-primary">VowTrack</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link href="/politicians" className="text-secondary hover:text-brand-primary transition-colors">
              Politicians
            </Link>
            <ThemeSelector />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  )
}