"use client"
import Link from 'next/link'
import Image from 'next/image'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'

export default function Header() {
  return (
    <header className="bg-surface shadow-sm border-b border-default">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/images/logo.png" alt="VowTrack Logo" width={40} height={40} className="rounded-full" />
            <span className="hidden sm:inline text-xl font-bold text-primary">VowTrack</span>
          </Link>
          {/* Centered Search */}
          <div className="flex-1">
            <SearchBar />
          </div>
          {/* Auth / User controls always visible */}
          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
