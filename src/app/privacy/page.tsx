import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Aurevo',
  description: 'Privacy Policy for Aurevo Virtual Try-On Extension and Website',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Aurevo ("we," "our," or "us") operates the Aurevo Virtual Try-On Chrome Extension and website 
                (collectively, the "Service"). This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our Service.
              </p>
              <p className="text-gray-700">
                By using our Service, you agree to the collection and use of information in accordance 
                with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personally Identifiable Information</h3>
              <p className="text-gray-700 mb-4">
                We collect the following personally identifiable information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Email address:</strong> For account creation, authentication, and communication</li>
                <li><strong>Name:</strong> For personalization and account management</li>
                <li><strong>Profile picture:</strong> Optional avatar image from Google OAuth</li>
                <li><strong>User ID:</strong> Unique identifier for account management</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Authentication Information</h3>
              <p className="text-gray-700 mb-4">
                We use secure authentication tokens and session data:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Access tokens:</strong> For secure API access (stored in HttpOnly cookies)</li>
                <li><strong>Refresh tokens:</strong> For maintaining login sessions</li>
                <li><strong>Session data:</strong> For maintaining user authentication state</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 User Activity Data</h3>
              <p className="text-gray-700 mb-4">
                We collect the following user activity data:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Virtual try-on requests:</strong> Product images, user photos, and fit instructions</li>
                <li><strong>Credit usage:</strong> Number of virtual try-ons performed and remaining credits</li>
                <li><strong>Extension interactions:</strong> Usage of extension features and buttons</li>
                <li><strong>Website navigation:</strong> Pages visited and features used</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Financial and Payment Information</h3>
              <p className="text-gray-700 mb-4">
                For credit purchases, we collect:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Payment transactions:</strong> Purchase amounts and payment status</li>
                <li><strong>Payment IDs:</strong> Razorpay transaction identifiers</li>
                <li><strong>Credit purchases:</strong> Number of credits purchased and transaction history</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.5 Website Content</h3>
              <p className="text-gray-700 mb-4">
                We process the following website content:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Product images:</strong> Clothing images from shopping websites</li>
                <li><strong>User photos:</strong> Images uploaded for virtual try-on</li>
                <li><strong>Generated images:</strong> AI-generated virtual try-on results</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Service Provision:</strong> To provide virtual try-on functionality</li>
                <li><strong>Authentication:</strong> To maintain secure user sessions</li>
                <li><strong>Credit Management:</strong> To track and manage virtual try-on credits</li>
                <li><strong>Payment Processing:</strong> To process credit purchases through Razorpay</li>
                <li><strong>AI Processing:</strong> To generate virtual try-on images using Google Gemini AI</li>
                <li><strong>Account Management:</strong> To manage user profiles and preferences</li>
                <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Encrypted Storage:</strong> All data is stored securely in Supabase with encryption</li>
                <li><strong>Row Level Security:</strong> Database access is restricted by user authentication</li>
                <li><strong>HttpOnly Cookies:</strong> Authentication tokens are stored in secure, HttpOnly cookies</li>
                <li><strong>HTTPS:</strong> All data transmission is encrypted using HTTPS</li>
                <li><strong>Access Controls:</strong> Strict access controls limit who can access your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Supabase:</strong> Database and authentication services</li>
                <li><strong>Google Gemini AI:</strong> AI image processing for virtual try-on</li>
                <li><strong>Razorpay:</strong> Payment processing for credit purchases</li>
                <li><strong>Google OAuth:</strong> Optional social login authentication</li>
              </ul>
              <p className="text-gray-700">
                These services have their own privacy policies, and we encourage you to review them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, 
                except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Service Providers:</strong> We share data with trusted third-party services 
                  (Supabase, Google Gemini AI, Razorpay) necessary for Service operation</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or 
                  to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, user data 
                  may be transferred as part of the business assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Opt out of certain data processing activities</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, please contact us at the information provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your information for as long as necessary to provide our Service and comply with 
                legal obligations:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Account Data:</strong> Retained until account deletion</li>
                <li><strong>Virtual Try-on Images:</strong> Retained for 30 days for service improvement</li>
                <li><strong>Payment Records:</strong> Retained for 7 years for tax and legal compliance</li>
                <li><strong>Usage Analytics:</strong> Retained for 2 years for service improvement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Chrome Extension Specific Information</h2>
              <p className="text-gray-700 mb-4">
                Our Chrome Extension has the following permissions and data access:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>activeTab:</strong> To extract product images from web pages for virtual try-on</li>
                <li><strong>identity:</strong> For Google OAuth login integration</li>
                <li><strong>storage:</strong> To save user preferences and session data locally</li>
                <li><strong>Host permissions:</strong> To access shopping websites for product image extraction</li>
              </ul>
              <p className="text-gray-700">
                The Extension does not collect browsing history or track your web activity beyond 
                what is necessary for the virtual try-on functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700">
                Our Service is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If you are a parent or guardian 
                and believe your child has provided us with personal information, please contact us 
                to have the information removed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure that such transfers comply with applicable data protection laws and implement 
                appropriate safeguards to protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> official.madhavendra@gmail.com</p>
                <p className="text-gray-700 mb-2"><strong>Website:</strong>https://aurevo-virtual-try-on.vercel.app/</p>
                <p className="text-gray-700"><strong>Address:</strong> Aurevo Privacy Team</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Compliance Certifications</h2>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>✓ We do not sell or transfer user data to third parties</strong>, apart from approved use cases 
                  (Supabase, Google Gemini AI, Razorpay) necessary for Service operation.
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>✓ We do not use or transfer user data for purposes unrelated to our Service's single purpose</strong> 
                  of providing virtual try-on functionality.
                </p>
                <p className="text-gray-700">
                  <strong>✓ We do not use or transfer user data to determine creditworthiness or for lending purposes</strong>.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
