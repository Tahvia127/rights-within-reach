import { Link } from 'react-router-dom'
import { LegalPage, ContactEmail } from '../components/LegalPage'

// Every key the site writes to the browser must be listed here. Search the
// frontend for localStorage / sessionStorage / caches before editing.
const STORED: { name: string; where: string; purpose: string; kept: string }[] = [
  { name: 'rwr.lang', where: 'Local storage', purpose: 'Remembers the language you picked.', kept: 'Until you clear it' },
  { name: 'rwr.dark', where: 'Local storage', purpose: 'Remembers whether you turned dark mode on or off.', kept: 'Until you clear it' },
  { name: 'rwr.state', where: 'Local storage', purpose: 'Remembers the state you picked, so you are not asked each time.', kept: 'Until you clear it' },
  { name: 'rwr.rate', where: 'Local storage', purpose: 'Remembers your read-aloud speed.', kept: 'Until you clear it' },
  { name: 'rwr.voices', where: 'Local storage', purpose: 'Remembers the read-aloud voice you picked for each language.', kept: 'Until you clear it' },
  { name: 'rwr.consent', where: 'Session storage', purpose: 'Remembers that you accepted the notice on the “Ask a question” page, so it is not shown again during the same visit.', kept: 'Until you close the tab' },
  { name: 'rwr-v1', where: 'Browser cache (service worker)', purpose: 'Keeps a copy of the site’s own pages and files so it loads faster and the topic pages still open without a connection.', kept: 'Until the site updates or you clear it' },
]

export default function Cookies() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="Rights Within Reach does not use cookies. It does save a few settings in your browser so the site works the way you left it. This page lists them."
    >
      <h2>Do we use cookies?</h2>
      <p>
        No. This site does not set any cookies, and it does not load advertising, analytics, or
        social media tools that would set them. The fonts and icons are served from our own
        site, not from another company.
      </p>

      <h2>Why there is no cookie banner</h2>
      <p>
        Cookie banners ask permission for tracking and other storage that is not needed to
        provide a service. We do not do any of that. The only things saved in your browser are
        the settings below, which you choose yourself and which stay on your device. They are
        not sent to us and are not used to identify or track you. If we ever add anything that
        is not strictly needed to run the site, we will update this page and ask for your
        consent first.
      </p>

      <h2>What is saved in your browser</h2>
      <div className="legal-table-wrap" role="region" aria-label="Items saved in your browser" tabIndex={0}>
        <table className="legal-table">
          <caption className="sr-only">Items this site saves in your browser</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">What it is for</th>
              <th scope="col">How long it stays</th>
            </tr>
          </thead>
          <tbody>
            {STORED.map((s) => (
              <tr key={s.name}>
                <th scope="row"><code>{s.name}</code></th>
                <td>{s.where}</td>
                <td>{s.purpose}</td>
                <td>{s.kept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>How to clear these settings</h2>
      <p>
        Open your browser’s settings, find the privacy or “site data” section, and clear the
        data for this site. The site will keep working; it will simply go back to its defaults
        and show the notice on the “Ask a question” page again. Using a private or incognito
        window also prevents these settings from being kept after you close it.
      </p>

      <h2>Other companies</h2>
      <p>
        When you follow a link to another organization’s website, that website may use its own
        cookies. We do not control them. Our <Link to="/privacy">Privacy Policy</Link> explains
        which companies help us run this site and what they receive.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this page: <ContactEmail />.
      </p>
    </LegalPage>
  )
}
