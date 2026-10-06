import { Link } from 'react-router-dom'
import { LegalPage, ContactEmail } from '../components/LegalPage'
import { SITE } from '../lib/siteInfo'

// Business details, non-affiliation notice, and third-party credits. Only state
// relationships (partners, reviewers, funders) here once they are in writing.
export default function About() {
  return (
    <LegalPage
      title="About & contact"
      intro="Who runs Rights Within Reach, what it is and is not, and how to reach us."
    >
      <h2>Who runs this site</h2>
      <dl className="legal-facts">
        <div><dt>Site</dt><dd>{SITE.name}</dd></div>
        <div><dt>Operated by</dt><dd>{SITE.operator}</dd></div>
        <div><dt>Location</dt><dd>{SITE.location}</dd></div>
        <div><dt>Email</dt><dd><ContactEmail /></dd></div>
        <div><dt>Cost</dt><dd>Free. We do not sell anything or take payments.</dd></div>
      </dl>

      <h2>What this site is</h2>
      <p>
        {SITE.name} is a free tool that explains, in plain language, what laws and programs say
        about housing, money and debt, home repairs, and public benefits, mainly for people in
        Illinois. It also points to organizations that may be able to help.
      </p>

      <h2>What this site is not</h2>
      <ul>
        <li>It is not a law firm, and the person who runs it is not a lawyer.</li>
        <li>It does not give legal advice or represent anyone.</li>
        <li>It is not a government agency or a legal aid organization.</li>
        <li>It is an independent student project, first built for the University of Chicago Tech Showcase. It is not affiliated with, sponsored by, or endorsed by the University of Chicago.</li>
        <li>It is not affiliated with, sponsored by, or endorsed by any organization listed or cited on the site, including Illinois Legal Aid Online.</li>
      </ul>

      <h2>How answers are made</h2>
      <p>
        Answers on the “Ask a question” page are written by an AI model (Claude, made by
        Anthropic) using a library of legal-aid guides, statutes, ordinances, and program rules,
        and sometimes a search of approved government and legal-aid websites. No lawyer reviews
        an answer before you see it, and AI can make mistakes. Each answer lists its sources so
        you can check them. See our <Link to="/terms">Terms of Use</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        Email <ContactEmail /> for questions about the site, corrections, accessibility
        problems, privacy requests, or to ask us to fix or remove a listing or source. We cannot
        answer questions about your legal situation by email. For that, please use
        the <Link to="/resources">Resources</Link> page.
      </p>

      <h2>Credits</h2>
      <ul>
        <li>
          Icons: <a href="https://www.streamlinehq.com" target="_blank" rel="noopener noreferrer">Core Line icons by Streamline</a>,
          used under the{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons Attribution 4.0 license</a>.
        </li>
        <li>Fonts: Fraunces and Poppins, used under the SIL Open Font License 1.1.</li>
        <li>
          Site software: open source under the MIT License, at{' '}
          <a href={SITE.repo} target="_blank" rel="noopener noreferrer">our GitHub repository</a>.
        </li>
        <li>Laws and source materials belong to their publishers. Each answer links to the original.</li>
      </ul>

      <p className="legal-copyright">
        © {SITE.copyrightYear} {SITE.operator}. Other organizations’ names and materials belong to their owners.
      </p>
    </LegalPage>
  )
}
