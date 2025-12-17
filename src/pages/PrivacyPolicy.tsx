import Layout from "@/components/layout/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
            <p>When you use our platform, we may collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (email, name, profile picture) when you sign up or connect social accounts</li>
              <li>Content you create, upload, or share on the platform</li>
              <li>Usage data and analytics to improve our services</li>
              <li>Information from third-party services you connect (e.g., Instagram, GitHub)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Authenticate your identity and manage your account</li>
              <li>Enable social features and content sharing</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate with you about updates and features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Third-Party Services</h2>
            <p>We integrate with third-party services like Instagram and GitHub for authentication and content features. When you connect these accounts, we receive limited information as permitted by those platforms and their privacy policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Disconnect linked social accounts at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Data Deletion</h2>
            <p>You can request deletion of your data at any time. Visit our <a href="/data-deletion" className="text-primary hover:underline">Data Deletion page</a> for instructions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
