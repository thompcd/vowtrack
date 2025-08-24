import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16 bg-surface border-t border-default text-sm">
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-semibold text-primary">VowTrack</p>
          <p className="text-muted mt-1">Tracking political promises & accountability.</p>
          <p className="text-muted mt-2">© {new Date().getFullYear()} VowTrack. All rights reserved.</p>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
          <Link href="/contact" className="text-secondary hover:text-brand-primary transition-colors">Contact Us</Link>
          <Link href="/terms" className="text-secondary hover:text-brand-primary transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="text-secondary hover:text-brand-primary transition-colors">Privacy Policy</Link>
          <Link href="/request-feature" className="text-secondary hover:text-brand-primary transition-colors">Request a Feature</Link>
        </nav>
      </div>
    </footer>
  )
}
