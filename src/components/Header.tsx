"use client"
import Link from 'next/link'
import Image from 'next/image'
import SearchBar from './SearchBar'
import { useState } from 'react'
import UserMenu from './UserMenu'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
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
          {/* Desktop Right Controls (collapsed into menu on small screens) */}
          <div className="hidden md:flex items-center gap-4">
            <UserMenu />
          </div>
          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden px-3 py-2 rounded-lg border border-default text-secondary hover:text-primary hover:bg-neutral-50 transition-colors"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-4 border-t border-default pt-4 space-y-4 animate-fade-in">
            <div className="flex flex-wrap gap-4 items-center">
              <UserMenu />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
