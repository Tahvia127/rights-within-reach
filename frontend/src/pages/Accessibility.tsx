import { LegalPage, ContactEmail } from '../components/LegalPage'

// Only list features and checks that are true today. Update the "How we check"
// and "Known limits" sections whenever the site is re-tested.
export default function Accessibility() {
  return (
    <LegalPage
      title="Accessibility"
      intro="Legal information is only useful if people can actually use it. We want this site to work for everyone, including people who use screen readers, keyboards, large text, or voice."
    >
      <h2>Our goal</h2>
      <p>
        We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. We are
        not there on every point yet, and we say where below.
      </p>

      <h2>What the site offers</h2>
      <ul>
        <li>A “Skip to main content” link at the top of every page.</li>
        <li>Every button, link, and form field can be reached and used with a keyboard, with a visible focus outline.</li>
        <li>A larger-text button (A+) and a dark mode button in the header.</li>
        <li>“Listen” buttons that read sections and answers aloud, with speed and voice settings.</li>
        <li>Voice input for questions, in browsers that support it.</li>
        <li>Headings, landmarks, labels, and status messages for screen readers.</li>
        <li>A pause button for the moving banner on the home page, and reduced motion when your device asks for it.</li>
        <li>Plain-language writing, in six languages.</li>
      </ul>

      <h2>How we check</h2>
      <p>
        We test pages with automated accessibility checks, by using the site with only a
        keyboard, and by measuring color contrast in both light and dark mode. The site has not
        yet been reviewed by an independent accessibility auditor or tested in a formal study
        with people who use assistive technology.
      </p>

      <h2>Known limits</h2>
      <ul>
        <li>Translations are machine-assisted and may be less clear than the English text.</li>
        <li>The policy pages, including this one, are in English only.</li>
        <li>Read-aloud depends on the voices installed on your device. Some languages may be read in a default voice.</li>
        <li>Voice input is not available in every browser.</li>
        <li>AI-written answers may sometimes use words that are harder to read than we intend.</li>
        <li>We link to other organizations’ websites and documents, which we do not control and which may not be accessible.</li>
      </ul>

      <h2>Tell us about a problem</h2>
      <p>
        If something on this site is hard to use, or you need information from it in another
        format, email <ContactEmail />. Please tell us the page and what went wrong. We read
        every message and will reply as soon as we can.
      </p>
      <p>
        We cannot give legal advice by email. If you need help with a legal problem right now,
        call or text 2-1-1, or see the organizations on the Resources page.
      </p>
    </LegalPage>
  )
}
