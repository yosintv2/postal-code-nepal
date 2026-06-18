import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | PostalNP — Nepal Postal Code Directory',
  description: 'Privacy policy for PostalNP. Learn how we collect, use and protect your information when you use our Nepal postal code directory.',
  keywords: 'postalNP privacy policy, nepal postal code website privacy',
  alternates: { canonical: 'https://postal.singhyogendra.com.np/privacy' },
  robots: { index: true, follow: false },
};

const UPDATED = 'June 19, 2026';

export default function PrivacyPage() {
  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-sub">Last updated: {UPDATED}</p>
      </div>

      <section className="section">
        <div className="about-body">
          <p>
            This Privacy Policy describes how PostalNP (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), operating at{' '}
            <strong>postal.singhyogendra.com.np</strong>, collects, uses, and protects information when
            you visit our website.
          </p>

          <h2>Information We Collect</h2>
          <p>
            PostalNP is a static informational website. We do not require registration or collect any
            personally identifiable information directly. However, third-party services used on this
            site may collect certain data as described below.
          </p>

          <h2>Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to improve your experience and to serve
            relevant advertisements. By using our site, you consent to the use of cookies in
            accordance with this policy.
          </p>
          <ul>
            <li><strong>Essential cookies:</strong> Required for the website to function properly.</li>
            <li><strong>Analytics cookies:</strong> Used to understand how visitors interact with our site (e.g. Google Analytics).</li>
            <li><strong>Advertising cookies:</strong> Used by Google AdSense to display relevant ads (see below).</li>
          </ul>

          <h2>Google AdSense and Advertising</h2>
          <p>
            PostalNP uses <strong>Google AdSense</strong> to display advertisements. Google and its
            partners may use cookies to serve ads based on your prior visits to our site or other
            websites on the internet.
          </p>
          <p>
            Google&rsquo;s use of advertising cookies enables it and its partners to serve ads to you
            based on your visit to our site and/or other sites on the Internet. You may opt out of
            personalised advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
            .
          </p>
          <p>
            For more information on how Google uses data from sites that use its services, visit:{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              How Google uses information from sites or apps that use Google services
            </a>
            .
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to external websites, including Nepal Post (nepalpost.gov.np).
            We are not responsible for the privacy practices of those sites and encourage you to
            review their privacy policies.
          </p>

          <h2>Data Security</h2>
          <p>
            PostalNP does not store any personal data on our servers. All postal code data displayed
            on this site is publicly available information from Nepal Post. We implement reasonable
            security measures to protect our site from unauthorized access.
          </p>

          <h2>Children&rsquo;s Privacy</h2>
          <p>
            Our website does not knowingly collect any personally identifiable information from
            children under 13. If you are a parent or guardian and believe your child has provided
            us with personal information, please contact us so we can take appropriate action.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically.
          </p>

          <h2>Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal data under
            applicable laws (such as GDPR for EU residents). Since PostalNP does not collect personal
            data directly, most of these rights relate to data held by third-party services such as
            Google. Please refer to their respective privacy policies for more information.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our
            GitHub repository at{' '}
            <a href="https://github.com/yosintv2/postal-code-nepal" target="_blank" rel="noopener noreferrer">
              github.com/yosintv2/postal-code-nepal
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
