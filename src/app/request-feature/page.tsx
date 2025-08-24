export const metadata = {
  title: 'Request a Feature - VowTrack'
}

export default function RequestFeaturePage() {
  return (
    <div className="min-h-screen bg-page py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-4">Request a Feature</h1>
        <p className="text-secondary mb-6">Help us make VowTrack even better</p>
        
        <div className="space-y-6">
          <p className="text-primary">
            We're always looking to improve VowTrack and would love to hear your ideas! 
            Whether you have a brilliant new feature in mind, spotted something that could work better, 
            or just want to share feedback, we're all ears.
          </p>

          {/* Email Section */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">Email Us Directly</h2>
            <p className="text-secondary mb-4">
              Send your feature requests, bug reports, or general feedback straight to our inbox. 
              We read every message and genuinely appreciate your input.
            </p>
            <p className="mb-4">
              <a 
                href="mailto:hello@vowtrack.app?subject=Feature%20Request" 
                className="text-brand-primary hover:text-brand-primary-hover font-medium"
              >
                hello@vowtrack.app
              </a>
            </p>
          </div>

          {/* Social Media Section */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">Join the Conversation</h2>
            <p className="text-secondary mb-4">
              Connect with us and other VowTrack users on social media. Share your ideas, 
              see what others are requesting, and stay updated on new features.
            </p>
            <div className="space-y-2">
              <p className="text-primary">
                <strong>Twitter/X:</strong> Mention 
                <span className="text-brand-primary font-medium"> @vowtrackapp</span> in your posts
              </p>
              <p className="text-primary">
                <strong>Reddit:</strong> Tag 
                <span className="text-brand-primary font-medium"> @vowtrackapp</span> in relevant discussions
              </p>
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">What Makes a Great Feature Request?</h2>
            <ul className="space-y-2 text-secondary">
              <li><strong className="text-primary">Be specific</strong> - The more details you provide, the better we can understand your needs</li>
              <li><strong className="text-primary">Explain the why</strong> - Help us understand the problem you're trying to solve</li>
              <li><strong className="text-primary">Share your use case</strong> - Real-world examples help us prioritize features</li>
              <li><strong className="text-primary">Keep it focused</strong> - One clear idea per request works best</li>
              <li><strong className="text-primary">Don't worry about technical details</strong> - Just tell us what you want to accomplish</li>
            </ul>
          </div>

          <div className="text-center py-4">
            <p className="text-primary font-medium">We're Listening</p>
            <p className="text-secondary text-sm mt-2">
              Every suggestion matters to us, whether it's a small UI tweak or a major new capability. 
              Your feedback directly shapes VowTrack's future, and we're committed to building features 
              that make a real difference in your experience.
            </p>
            <p className="text-muted text-xs mt-4">We may contact you for clarification on your requests.</p>
          </div>
        </div>
      </div>
    </div>
  )
}