import { Link } from 'react-router-dom'
import { LegalPage, ContactEmail } from '../components/LegalPage'
import { SITE } from '../lib/siteInfo'

// Keep this page in sync with what the code actually does. If you turn on
// ANALYTICS_LOG_QUESTIONS, QUESTION_GAP_LOG, or ANALYTICS_HASH_IP on the
// backend, or add any analytics/ads/embeds, update sections 2-5 first.
export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This page explains what information Rights Within Reach handles when you use the site, why, and who else is involved."
    >
      <h2>The short version</h2>
      <ul>
        <li>You do not need an account. We do not ask for your name, email, or phone number.</li>
        <li>We do not use advertising, tracking cookies, or third-party analytics.</li>
        <li>When you ask a question, the text is sent to our server and to our AI provider, Anthropic, so an answer can be written.</li>
        <li>Please do not put names, addresses, Social Security numbers, case numbers, or account numbers in your question.</li>
        <li>This site is not a law firm. What you type is not protected by attorney-client privilege.</li>
      </ul>

      <h2>1. Who we are</h2>
      <p>
        {SITE.name} is an independent project operated by {SITE.operator} in {SITE.location}.
        In this policy, “we” and “us” mean the operator of this site. You can reach us at <ContactEmail />.
      </p>

      <h2>2. Information we handle</h2>
      <h3>Questions you ask</h3>
      <p>
        When you use the “Ask a question” page, we receive the text of your question (typed or
        dictated), the language you are using, and the choices you make in the guided questions:
        your state, your general area, the topic, and your ZIP code if you choose to enter one.
        The ZIP code is optional.
      </p>
      <p>
        We use this only to find relevant sources, write your answer, and suggest organizations
        that serve your area. A copy of the question and its answer is held in our server’s
        temporary memory for up to one hour so that a repeated question can be answered faster.
        We do not save the text of your question to a database or to our usage log.
      </p>

      <h3>Usage records</h3>
      <p>
        For each request to our server we record: the date and time, which feature was used,
        whether it succeeded, how long it took, the language, the topic, the state and general
        area selected, whether a ZIP code was given (not the ZIP code itself), the length of the
        question in characters, and whether the question was declined. This record does not
        include your question, your IP address, or anything that names you. We use it to see
        which topics and languages people need and to find problems.
      </p>

      <h3>Feedback</h3>
      <p>
        If you tap “Yes” or “No” under “Was this helpful?”, we record that answer along with the
        language and topic. It is not linked to your question or to you.
      </p>

      <h3>Technical information</h3>
      <p>
        Like every website, our servers receive your IP address and basic browser information
        when your device connects. We use your IP address briefly, in memory, to limit how many
        requests one connection can send (this protects the service from abuse). The companies
        that host the site (listed below) also process this information in their own
        infrastructure logs.
      </p>

      <h3>Email</h3>
      <p>
        If you email us, we receive your email address and whatever you write. We use it only to
        reply. Please do not email us details of a legal problem; we cannot give legal advice.
      </p>

      <h2>3. Information we do not collect</h2>
      <ul>
        <li>No account, name, email address, or phone number is required or requested by the site.</li>
        <li>No advertising or cross-site tracking.</li>
        <li>No precise location. We never ask your browser for your location.</li>
        <li>No audio. If you use voice input, your browser turns speech into text; we only receive the text (see section 6).</li>
      </ul>

      <h2>4. How we use information</h2>
      <ul>
        <li>To answer your question and suggest organizations that may help.</li>
        <li>To keep the service running, secure, and protected from abuse.</li>
        <li>To understand, in aggregate, which topics and languages are needed so we can improve the site.</li>
      </ul>
      <p>We do not sell personal information, and we do not share it for advertising.</p>

      <h2>5. Companies that help us run the site</h2>
      <p>These service providers process information on our behalf, under their own terms and privacy policies:</p>
      <ul>
        <li>
          <strong>Anthropic</strong> (AI model provider). Receives the text of your question,
          and the state, area, and topic you chose, in order to translate the question, search
          approved government and legal-aid websites when needed, and write the answer.
          Anthropic’s published commercial terms say it does not use this kind of data to train
          its models by default. See{' '}
          <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">Anthropic’s privacy policy</a>.
        </li>
        <li>
          <strong>Railway</strong> (server hosting). Runs our server, so it processes the
          requests described above, including IP addresses.
        </li>
        <li>
          <strong>Vercel</strong> (website hosting). Delivers the pages of this site, so it
          processes IP addresses and the addresses of the pages you load.
        </li>
      </ul>
      <p>
        We may also disclose information if the law requires it, or to protect the safety of a
        person or the security of the service. Because we do not store your question or your IP
        address in our own records, we generally have very little that could be disclosed.
      </p>

      <h2>6. Voice features</h2>
      <p>
        <strong>Speak your question.</strong> This uses the speech recognition built into your
        browser. In some browsers, including Chrome, your audio is sent to the browser maker’s
        servers to be turned into text. We never receive the audio. Your browser will ask for
        microphone permission first, and you can type instead.
      </p>
      <p>
        <strong>Listen (read aloud).</strong> This uses the voices on your device or browser.
        Depending on your browser and the voice you choose, the text being read may be processed
        by the browser maker. We do not receive or record anything from this feature.
      </p>

      <h2>7. What is stored on your device</h2>
      <p>
        We do not use cookies. We save a few settings in your browser (language, dark mode,
        state, and read-aloud preferences) so the site works the way you left it. Details are in
        our <Link to="/cookies">Cookie Policy</Link>.
      </p>

      <h2>8. Shared links</h2>
      <p>
        The “Copy link” button on an answer creates a link that contains the text of your
        question, so that opening it asks the same question again. Anyone who has the link can
        read the question in it, and it may be saved in browser history and in server logs. Only
        share a link if you are comfortable with that.
      </p>

      <h2>9. Links to other organizations</h2>
      <p>
        This site links to legal aid organizations, government agencies, and other websites, and
        offers phone links to call them. We do not control those organizations. What you share
        with them is covered by their own privacy practices.
      </p>

      <h2>10. How long we keep information</h2>
      <ul>
        <li>Questions and answers: up to one hour in temporary server memory, then discarded.</li>
        <li>Usage records: kept in size-limited log files. Older entries are overwritten as new ones are added.</li>
        <li>Emails: as long as needed to reply and keep a record of the conversation.</li>
      </ul>

      <h2>11. Your choices</h2>
      <ul>
        <li>You can use the topic pages and the organization list without asking a question.</li>
        <li>You can skip the guided questions and leave the ZIP code blank.</li>
        <li>You can clear the settings saved in your browser at any time (see the <Link to="/cookies">Cookie Policy</Link>).</li>
        <li>
          You can contact us at <ContactEmail /> to ask what information we hold about you or to
          ask us to delete it. Because we do not keep names, accounts, or IP addresses with our
          records, we usually cannot match a record to a person, but we will tell you what we can.
        </li>
      </ul>
      <p>
        Depending on where you live, you may have additional privacy rights under state law. We
        will respond to any request we can verify, wherever you live.
      </p>

      <h2>12. Children</h2>
      <p>
        This site is intended for adults and is not directed to children under 13. We do not
        knowingly collect personal information from children under 13. If you believe a child
        has given us personal information, contact us and we will delete what we can.
      </p>

      <h2>13. Security</h2>
      <p>
        The site and our server use encrypted (HTTPS) connections. No website can promise
        perfect security, which is one reason we ask you not to include identifying details in
        your question.
      </p>

      <h2>14. “Do Not Track”</h2>
      <p>
        We do not track you across other websites or over time, so the site behaves the same
        whether or not your browser sends a “Do Not Track” or Global Privacy Control signal.
      </p>

      <h2>15. Where information is processed</h2>
      <p>
        The site is operated from the United States and is intended for people in the United
        States. Information is processed mainly in the United States.
      </p>

      <h2>16. Changes to this policy</h2>
      <p>
        If we change how we handle information, we will update this page and the date at the top
        before the change takes effect.
      </p>

      <h2>17. Contact</h2>
      <p>
        {SITE.name}, operated by {SITE.operator}, {SITE.location}. Email: <ContactEmail />.
      </p>
    </LegalPage>
  )
}
