export const metadata = {
  title: 'Privacy Policy - VowTrack'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-page py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-4">Privacy Policy</h1>
        <p className="text-secondary mb-6">How we handle your data and protect your privacy</p>
        
        <div className="space-y-6">
          {/* Data We Collect */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">Data We Collect</h2>
            <p className="text-secondary">
              Email addresses for authentication, and user-generated content (politicians, promises, votes).
            </p>
          </div>

          {/* How We Use Data */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">How We Use Data</h2>
            <p className="text-secondary">
              To provide scoring, moderation, and improve the platform.
            </p>
          </div>

          {/* Cookies / Local Storage */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">Cookies / Local Storage</h2>
            <p className="text-secondary">
              Used for session management and theme preference.
            </p>
          </div>

          {/* Deletion */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">Deletion</h2>
            <p className="text-secondary">
              Request data deletion by emailing 
              <a 
                href="mailto:hello@vowtrack.app?subject=Data%20Deletion%20Request" 
                className="text-brand-primary hover:text-brand-primary-hover font-medium ml-1"
              >
                hello@vowtrack.app
              </a>.
            </p>
          </div>

          {/* User Data Not for Sale */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">User Data Not for Sale</h2>
            <p className="text-secondary">
              We do not sell user data, personally identifiable information, or otherwise identify users in shared metrics.
            </p>
          </div>

          {/* Content Ownership */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">Content Ownership</h2>
            <p className="text-secondary">
              Content that is posted within the app is considered property of the VowTrack platform and may be shared with members, partners or customers.
            </p>
          </div>

          {/* Changes to This Policy */}
          <div className="bg-surface border border-default rounded-lg p-6">
            <h2 className="text-xl font-semibold text-primary mb-3">Changes to This Policy</h2>
            <p className="text-secondary">
              We may update this policy. Continued use of the service constitutes acceptance of the new policy.
            </p>
          </div>

          <div className="text-center py-4">
            <p className="text-muted text-xs">
              Questions about this policy? Contact us at 
              <a 
                href="mailto:hello@vowtrack.app?subject=Privacy%20Policy%20Question" 
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