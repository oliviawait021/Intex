import Footer from '../components/Footer';
import WelcomeBand from '../components/WelcomeBand';
function PrivacyPage() {
  const styles = {
    container: {
      color: '#e6e6e6',
      padding: '4rem 2rem',
      maxWidth: '1000px',
      margin: 'auto',
      lineHeight: 1.8,
    },
    heading1: {
      fontSize: '2.5rem',
      textAlign: 'left' as const,
      color: '#ffffff',
      marginBottom: '2rem',
    },
    heading2: {
      fontSize: '1.5rem',
      textAlign: 'left' as const,
      marginTop: '2.5rem',
      marginBottom: '1rem',
      color: '#ffffff',
      fontWeight: '600',
    },
    paragraph: {
      marginBottom: '1rem',
      textAlign: 'left' as const,
    },
    list: {
      paddingLeft: '1.5rem',
      marginBottom: '1rem',
      textAlign: 'left' as const,
    },
    link: {
      color: '#ccc',
      textDecoration: 'underline',
    },
  };

  return (
    <>
      <WelcomeBand />
      <div style={styles.container}>
        <h1 style={styles.heading1}>Privacy Policy</h1>
        <p style={styles.paragraph}>
          <strong>Effective Date:</strong> 04/11/2024
          <br />
          <strong>Last Updated:</strong> 04/11/2024
        </p>

        <p style={styles.paragraph}>
          CineNiche respects your privacy and is committed to protecting the
          personal data of our users. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit
          our platform.
        </p>

        <p style={styles.paragraph}>
          This site is built as a prototype movie recommendation system for
          educational purposes as part of the <strong>INTEX WINTER 2025</strong>{' '}
          project. Despite its academic nature, this policy ensures compliance
          with the <strong>General Data Protection Regulation (GDPR)</strong>.
        </p>

        <h2 style={styles.heading2}>1. Information We Collect</h2>
        <ul style={styles.list}>
          <li>
            <strong>Account Information:</strong> Name, email address, password
            (securely hashed)
          </li>
          <li>
            <strong>Demographics:</strong> Age, gender, city, state, zip code
          </li>
          <li>
            <strong>Viewing Preferences:</strong> Ratings, genres of interest,
            watch history
          </li>
          <li>
            <strong>Subscription Data:</strong> Usage of platforms like Netflix,
            Hulu, Disney+
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, browser type, device
            info, login timestamps
          </li>
          <li>
            <strong>Usage Data:</strong> Pages visited, interactions with
            content, search/filter activity
          </li>
        </ul>

        <h2 style={styles.heading2}>2. How We Use Your Data</h2>
        <ul style={styles.list}>
          <li>To provide, maintain, and improve our recommendation system</li>
          <li>To personalize your experience</li>
          <li>To enable secure authentication and role-based access</li>
          <li>To analyze trends through anonymized statistics</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 style={styles.heading2}>3. Legal Basis for Processing</h2>
        <ul style={styles.list}>
          <li>
            <strong>Consent:</strong> For personalized recommendations
          </li>
          <li>
            <strong>Contract:</strong> To deliver our services
          </li>
          <li>
            <strong>Legal Obligation:</strong> To meet legal requirements
          </li>
          <li>
            <strong>Legitimate Interest:</strong> To enhance user experience and
            performance
          </li>
        </ul>

        <h2 style={styles.heading2}>
          4. Sharing Information with Third Parties
        </h2>
        <ul style={styles.list}>
          <li>
            <strong>Business Partners:</strong> Including content contributors
            and distributors
          </li>
          <li>
            <strong>Social Networks:</strong> If you choose to share CineNiche
            content
          </li>
          <li>
            <strong>Service Providers:</strong> Under data protection agreements
          </li>
        </ul>

        <h2 style={styles.heading2}>5. Advertising</h2>
        <p style={styles.paragraph}>
          We may display advertisements on CineNiche. Advertisers may use
          cookies to measure effectiveness and tailor ads. We do not sell your
          data to advertisers.
        </p>

        <h2 style={styles.heading2}>6. Data Sharing</h2>
        <p style={styles.paragraph}>
          We never sell or rent your data. Data may be shared with trusted
          academic evaluators and necessary service providers only.
        </p>

        <h2 style={styles.heading2}>7. Data Retention</h2>
        <p style={styles.paragraph}>
          Data is retained only as long as needed for the purposes above or by
          law.
        </p>

        <h2 style={styles.heading2}>8. Your Rights</h2>
        <ul style={styles.list}>
          <li>Access, correct, or delete your data</li>
          <li>Restrict or object to processing</li>
          <li>Withdraw consent</li>
          <li>Request portability of your data</li>
        </ul>
        <p style={styles.paragraph}>
          Contact us:{' '}
          <a href="mailto:privacy@cineniche.dev" style={styles.link}>
            privacy@cineniche.dev
          </a>
        </p>

        <h2 style={styles.heading2}>9. Cookies and Tracking</h2>
        <p style={styles.paragraph}>
          We use cookies for session security, analytics, and improving
          recommendations. You may manage cookie preferences at any time.
        </p>

        <h2 style={styles.heading2}>10. Data Security</h2>
        <ul style={styles.list}>
          <li>Encrypted connections via HTTPS</li>
          <li>Secure password storage</li>
          <li>Role-based access control</li>
          <li>Isolated databases</li>
        </ul>

        <h2 style={styles.heading2}>11. Children’s Privacy</h2>
        <p style={styles.paragraph}>
          CineNiche does not allow registration by users under 13 without
          verified parental consent.
        </p>

        <h2 style={styles.heading2}>12. International Data Transfers</h2>
        <p style={styles.paragraph}>
          Data may be transferred outside the EEA under GDPR-approved
          safeguards.
        </p>

        <h2 style={styles.heading2}>13. Deleting Your CineNiche Account</h2>
        <p style={styles.paragraph}>
          You may delete your account via your profile settings. Data may be
          retained as required by law for auditing or legal purposes.
        </p>

        <h2 style={styles.heading2}>14. Contact Us</h2>
        <p style={styles.paragraph}>
          Questions or concerns? Email us at:{' '}
          <a href="mailto:privacy@cineniche.dev" style={styles.link}>
            privacy@cineniche.dev
          </a>
        </p>

        <h2 style={styles.heading2}>15. Updates to This Policy</h2>
        <p style={styles.paragraph}>
          This Privacy Policy may be updated. Please check this page for the
          latest version.
        </p>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPage;
