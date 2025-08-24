export const metadata = {
  title: 'Terms of Service - VowTrack'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-page py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-4">Terms of Service</h1>
        <p className="text-secondary mb-6">Basic usage expectations and guidelines for the VowTrack platform</p>

        <div className="space-y-6">
          {/* Use of Service */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">1. Use of Service</h2>
            <div className="text-secondary space-y-3">
              <p>You agree to use VowTrack for lawful purposes and avoid misuse or data manipulation.</p>
              <p>Prohibited activities include:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Creating fake accounts or impersonating others</li>
                <li>Posting spam, harassment, or hateful content</li>
                <li>Manipulating voting or scoring systems</li>
                <li>Scraping data without permission</li>
                <li>Circumventing security measures</li>
              </ul>
            </div>
          </div>

          {/* User Content */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">2. User Content</h2>
            <div className="text-secondary space-y-3">
              <p>Content you submit (politicians, promises, votes) may be moderated or removed at our discretion.</p>
              <p>By posting content, you agree that:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You have the right to share the content</li>
                <li>Content is factually accurate to the best of your knowledge</li>
                <li>We may moderate, edit, or remove content that violates our guidelines</li>
                <li>You retain ownership of your original content</li>
              </ul>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">3. Community Guidelines</h2>
            <div className="text-secondary space-y-3">
              <p>VowTrack aims to foster respectful political discourse. We expect users to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Be respectful in discussions and interactions</li>
                <li>Focus on facts and policy positions rather than personal attacks</li>
                <li>Report inappropriate content or behavior</li>
                <li>Respect different political viewpoints and engage constructively</li>
              </ul>
            </div>
          </div>

          {/* Account Responsibilities */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">4. Account Responsibilities</h2>
            <div className="text-secondary space-y-3">
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us of any unauthorized account access</li>
                <li>Providing accurate registration information</li>
              </ul>
            </div>
          </div>

          {/* Data and Privacy */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">5. Data and Privacy</h2>
            <p className="text-secondary">
              Your use of VowTrack is also governed by our Privacy Policy. We collect and use data 
              as described in that policy to provide and improve our services.
            </p>
          </div>

          {/* Intellectual Property */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">6. Intellectual Property</h2>
            <div className="text-secondary space-y-3">
              <p>VowTrack and its features are protected by intellectual property laws. You may not:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Copy, modify, or distribute our software or design</li>
                <li>Use our trademarks or branding without permission</li>
                <li>Reverse engineer our platform or algorithms</li>
              </ul>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">7. Termination</h2>
            <p className="text-secondary">
              We may suspend or terminate your account for violations of these terms. 
              You may delete your account at any time by contacting us at 
              <a 
                href="mailto:hello@vowtrack.app?subject=Account%20Deletion" 
                className="text-brand-primary hover:text-brand-primary-hover font-medium ml-1"
              >
                hello@vowtrack.app
              </a>.
            </p>
          </div>

          {/* No Warranty */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">8. No Warranty</h2>
            <p className="text-secondary">
              The service is provided "as is" without warranties. Data may be incomplete or community-sourced. 
              We make no guarantees about accuracy, availability, or fitness for any particular purpose.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">9. Limitation of Liability</h2>
            <p className="text-secondary">
              VowTrack's liability is limited to the maximum extent permitted by law. 
              We are not liable for any indirect, incidental, or consequential damages 
              arising from your use of the platform.
            </p>
          </div>

          {/* Changes to Terms */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">10. Changes to Terms</h2>
            <p className="text-secondary">
              We may update these terms from time to time. We'll notify users of significant changes. 
              Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div className="text-center py-4">
            <p className="text-muted text-xs">
              Questions about these terms? Contact us at 
              <a 
                href="mailto:hello@vowtrack.app?subject=Terms%20of%20Service%20Question" 
                className="text-brand-primary hover:text-brand-primary-hover ml-1"
              >
                hello@vowtrack.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}