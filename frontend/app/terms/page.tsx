import type { Metadata } from "next";
import { LegalLayout } from "@/src/components/legal/LegalLayout";
import "@/src/components/legal/legal.css";

export const metadata: Metadata = {
  title: "Terms of Service | Delok",
  description: "Terms governing the use of the Delok log monitoring platform.",
  alternates: { canonical: "https://delok.site/terms" },
};

const TOC = [
  { id: "service", label: "1. The Delok Service" },
  { id: "account", label: "2. Your Account" },
  { id: "organizations", label: "3. Organizations and Projects" },
  { id: "your-data", label: "4. Your Data" },
  { id: "sensitive", label: "5. Sensitive Information in Logs" },
  { id: "acceptable-use", label: "6. Acceptable Use" },
  { id: "api-sdk", label: "7. API and SDK Usage" },
  { id: "ip", label: "8. Intellectual Property" },
  { id: "third-party", label: "9. Third-Party Services" },
  { id: "availability", label: "10. Service Availability" },
  { id: "paid", label: "11. Free and Paid Services" },
  { id: "suspension", label: "12. Suspension and Termination" },
  { id: "disclaimer", label: "13. Disclaimer" },
  { id: "liability", label: "14. Limitation of Liability" },
  { id: "indemnification", label: "15. Indemnification" },
  { id: "changes-service", label: "16. Changes to the Service" },
  { id: "changes-terms", label: "17. Changes to These Terms" },
  { id: "governing-law", label: "18. Governing Law" },
  { id: "contact", label: "19. Contact" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="September 9, 2026"
      toc={TOC}
    >
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use
        of the Delok service (&quot;Delok&quot;, &quot;Service&quot;,
        &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
      </p>
      <p>
        By creating an account or using Delok, you agree to these Terms. If you
        do not agree with these Terms, you may not use the Service.
      </p>

      <h2 id="service">1. The Delok Service</h2>
      <p>
        Delok is a log monitoring platform that allows developers and
        organizations to collect, store, and view application logs.
      </p>
      <p>The Service may include functionality for:</p>
      <ul>
        <li>creating and managing organizations;</li>
        <li>creating and managing projects;</li>
        <li>generating and managing project-scoped API keys;</li>
        <li>sending application logs through the Delok SDK or API;</li>
        <li>storing application log events;</li>
        <li>viewing application logs;</li>
        <li>searching and inspecting application logs; and</li>
        <li>
          managing access to your Delok account, organizations, and projects.
        </li>
      </ul>
      <p>
        We may modify, improve, suspend, or discontinue parts of the Service
        from time to time.
      </p>

      <h2 id="account">2. Your Account</h2>
      <p>
        You may need to create an account to use certain features of Delok.
        Authentication is provided via OAuth (Google and GitHub) through Better
        Auth.
      </p>
      <p>You are responsible for:</p>
      <ul>
        <li>providing accurate account information;</li>
        <li>maintaining the security of your account;</li>
        <li>keeping your authentication credentials secure;</li>
        <li>all activity occurring through your account; and</li>
        <li>
          notifying us if you believe your account has been accessed without
          authorization.
        </li>
      </ul>
      <p>
        You must not use another person&apos;s account without authorization.
      </p>

      <h2 id="organizations">3. Organizations and Projects</h2>
      <p>
        Delok allows users to create organizations and projects for managing
        application logs. Projects belong to an organization.
      </p>
      <p>
        Organizations support roles: Owner and Member. Owners can manage
        organization settings and projects; members have access to organization
        resources as permitted by the Service.
      </p>
      <p>
        You are responsible for the organizations, projects, users, and data
        that you create or manage through the Service.
      </p>

      <h2 id="your-data">4. Your Data</h2>
      <p>
        You retain ownership of the application logs, data, and other content
        that you submit to Delok (&quot;User Content&quot;).
      </p>
      <p>
        You grant Delok a limited, non-exclusive right to host, process, store,
        transmit, and display User Content only as necessary to provide,
        maintain, secure, and operate the Service.
      </p>
      <p>We do not claim ownership of your User Content.</p>
      <p>
        You are responsible for ensuring that you have the necessary rights and
        permissions to submit User Content to Delok.
      </p>

      <h2 id="sensitive">5. Sensitive Information in Logs</h2>
      <p>Delok is designed to receive application logs.</p>
      <p>
        You should not intentionally submit passwords, API keys, authentication
        tokens, private keys, payment-card information, or other highly
        sensitive information unless such submission is necessary and
        appropriate for your use of the Service.
      </p>
      <p>
        You are responsible for the content of the logs and other information
        that you submit to Delok.
      </p>

      <h2 id="acceptable-use">6. Acceptable Use</h2>
      <p>You agree not to use Delok to:</p>
      <ul>
        <li>violate applicable laws or regulations;</li>
        <li>gain unauthorized access to accounts, systems, or data;</li>
        <li>interfere with or disrupt the Service;</li>
        <li>attempt to bypass authentication or security controls;</li>
        <li>transmit malicious software;</li>
        <li>abuse or attack Delok infrastructure;</li>
        <li>access another user&apos;s data without authorization;</li>
        <li>use the Service to facilitate unlawful activity; or</li>
        <li>
          circumvent technical limitations or usage restrictions imposed by the
          Service.
        </li>
      </ul>
      <p>
        We may take reasonable action if we determine that use of the Service
        presents a security, legal, or operational risk.
      </p>

      <h2 id="api-sdk">7. API and SDK Usage</h2>
      <p>
        Delok provides SDKs and APIs for submitting application logs via
        project-scoped API keys.
      </p>
      <p>
        You are responsible for using the SDKs and APIs in accordance with their
        applicable documentation and technical limitations.
      </p>
      <p>
        You must not intentionally abuse, overload, or interfere with Delok APIs
        or infrastructure.
      </p>
      <p>
        We may impose reasonable rate limits or other technical restrictions to
        maintain the reliability and security of the Service.
      </p>

      <h2 id="ip">8. Intellectual Property</h2>
      <p>
        The Delok Service, including its software, interface, branding, design,
        documentation, and other materials provided by Delok, is owned by or
        licensed to Delok and is protected by applicable intellectual property
        laws.
      </p>
      <p>
        Except as expressly permitted by these Terms, you may not copy, modify,
        distribute, sell, lease, reverse engineer, or create derivative works of
        the Service.
      </p>
      <p>
        These Terms do not transfer ownership of your User Content to Delok.
      </p>

      <h2 id="third-party">9. Third-Party Services</h2>
      <p>
        Delok may integrate with or rely on third-party services, including
        authentication, hosting, infrastructure, and other service providers.
      </p>
      <p>
        Your use of third-party services may be subject to the terms and privacy
        policies of those providers.
      </p>
      <p>
        Delok is not responsible for third-party services that are outside our
        control.
      </p>

      <h2 id="availability">10. Service Availability</h2>
      <p>
        We aim to provide a reliable service, but we do not guarantee that Delok
        will always be available, uninterrupted, secure, or error-free.
      </p>
      <p>
        The Service may occasionally be unavailable due to maintenance, updates,
        infrastructure problems, technical failures, security incidents, or
        circumstances beyond our reasonable control.
      </p>
      <p>
        Unless separately agreed in writing, Delok does not provide a guaranteed
        uptime commitment or service-level agreement.
      </p>

      <h2 id="paid">11. Free and Paid Services</h2>
      <p>
        Delok may introduce paid features or subscription plans in the future.
        If paid features are introduced, additional pricing, billing,
        subscription, or service-specific terms may apply.
      </p>

      <h2 id="suspension">12. Suspension and Termination</h2>
      <p>You may stop using Delok at any time.</p>
      <p>We may suspend or terminate access to the Service if:</p>
      <ul>
        <li>you materially violate these Terms;</li>
        <li>your use presents a security or legal risk;</li>
        <li>you engage in abuse of the Service;</li>
        <li>required by applicable law; or</li>
        <li>necessary to protect the Service, our users, or others.</li>
      </ul>
      <p>
        Where reasonably appropriate, we may provide notice before suspension or
        termination.
      </p>
      <p>Upon termination, your right to access the Service will end.</p>

      <h2 id="disclaimer">13. Disclaimer</h2>
      <p>
        Delok is provided on an &quot;as is&quot; and &quot;as available&quot;
        basis to the extent permitted by applicable law.
      </p>
      <p>We do not guarantee that:</p>
      <ul>
        <li>the Service will always be available;</li>
        <li>all application logs will be successfully received or stored;</li>
        <li>the Service will be free from errors;</li>
        <li>the Service will meet every particular requirement; or</li>
        <li>
          information displayed by the Service will always be complete or
          accurate.
        </li>
      </ul>
      <p>
        You are responsible for maintaining appropriate backups and safeguards
        for important data.
      </p>

      <h2 id="liability">14. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, Delok and its
        operators, contributors, and service providers will not be liable for
        indirect, incidental, special, consequential, or punitive damages
        arising from or related to your use of the Service.
      </p>
      <p>
        This may include loss of data, loss of profits, loss of business
        opportunities, or interruption of business.
      </p>
      <p>
        Nothing in these Terms excludes or limits liability that cannot legally
        be excluded or limited under applicable law.
      </p>

      <h2 id="indemnification">15. Indemnification</h2>
      <p>
        To the extent permitted by applicable law, you agree to defend,
        indemnify, and hold harmless Delok and its operators from claims,
        liabilities, damages, losses, and expenses arising from:
      </p>
      <ul>
        <li>your misuse of the Service;</li>
        <li>your violation of these Terms;</li>
        <li>your violation of applicable law; or</li>
        <li>User Content that you submit to the Service.</li>
      </ul>

      <h2 id="changes-service">16. Changes to the Service</h2>
      <p>We may modify or discontinue features of Delok from time to time.</p>
      <p>
        We will make reasonable efforts to communicate material changes when
        appropriate.
      </p>
      <p>
        We are not responsible for losses resulting from changes, suspension, or
        discontinuation of features, except where otherwise required by
        applicable law.
      </p>

      <h2 id="changes-terms">17. Changes to These Terms</h2>
      <p>We may update these Terms from time to time.</p>
      <p>
        When we make changes, we will update the &quot;Last updated&quot; date
        at the beginning of these Terms.
      </p>
      <p>
        Your continued use of Delok after the updated Terms become effective
        means that you accept the revised Terms, to the extent permitted by
        applicable law.
      </p>

      <h2 id="governing-law">18. Governing Law</h2>
      <p>
        These Terms are governed by applicable law, subject to any mandatory
        legal requirements applicable to your use of the Service.
      </p>

      <h2 id="contact">19. Contact</h2>
      <p>If you have questions about these Terms, please contact us at:</p>
      <p>
        <strong>
          Email:{" "}
          <a href="mailto:yuandadhamap@gmail.com">yuandadhamap@gmail.com</a>
        </strong>
      </p>
    </LegalLayout>
  );
}
