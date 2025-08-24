export const metadata = {
  title: 'Contact Us - VowTrack'
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-page py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-4">Contact Us</h1>
        <p className="text-secondary mb-6">Have questions, feedback, or partnership ideas? We'd love to hear from you.</p>
        
        <div className="space-y-6">
          {/* Email Section */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">Email Us</h2>
            <p className="text-secondary mb-4">
              The best way to reach our team for questions, feedback, support, or partnership inquiries.
            </p>
            <p className="mb-3">
              <a 
                href="mailto:hello@vowtrack.app" 
                className="text-brand-primary hover:text-brand-primary-hover font-medium"
              >
                hello@vowtrack.app
              </a>
            </p>
            <p className="text-muted text-sm">We typically respond within 2–3 business days.</p>
          </div>

          {/* Social Media Section */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">Find Us on Social Media</h2>
            <p className="text-secondary mb-4">
              Follow us for updates, engage with our community, or reach out with quick questions.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-primary font-medium">Twitter/X:</span>
                <span className="text-brand-primary font-medium">@vowtrackapp</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary font-medium">Reddit:</span>
                <span className="text-brand-primary font-medium">@vowtrackapp</span>
              </div>
            </div>
          </div>

          {/* What to Include Section */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">What to Include in Your Message</h2>
            <ul className="space-y-2 text-secondary">
              <li><strong className="text-primary">General inquiries:</strong> Tell us what you're looking for</li>
              <li><strong className="text-primary">Technical issues:</strong> Describe what happened and when</li>
              <li><strong className="text-primary">Feature requests:</strong> Explain the problem you want solved</li>
              <li><strong className="text-primary">Partnerships:</strong> Share your organization and collaboration ideas</li>
              <li><strong className="text-primary">Press/Media:</strong> Include your publication and story angle</li>
            </ul>
          </div>

          <div className="text-center py-4">
            <p className="text-primary font-medium">We're Here to Help</p>
            <p className="text-secondary text-sm mt-2">
              Whether you're a researcher, voter, journalist, or just curious about political accountability, 
              we're committed to making VowTrack work for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}