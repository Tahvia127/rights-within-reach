import { Link } from 'react-router-dom'
import { LegalPage, ContactEmail } from '../components/LegalPage'
import { SITE } from '../lib/siteInfo'

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="These are the rules for using Rights Within Reach. By using the site, you agree to them. If you do not agree, please do not use the site."
    >
      <h2>The most important points</h2>
      <ul>
        <li>This site gives general legal information. It does not give legal advice.</li>
        <li>We are not a law firm and not your lawyer. Using the site does not create an attorney-client relationship.</li>
        <li>Answers on the “Ask a question” page are written by an AI system and can be wrong, incomplete, or out of date.</li>
        <li>Do not rely on this site alone for a decision about your housing, money, benefits, or a court case. Talk to a lawyer or a legal aid organization.</li>
        <li>In an emergency, call 911.</li>
      </ul>

      <h2>1. Who we are</h2>
      <p>
        {SITE.name} (“the site”, “we”, “us”) is an independent project operated by{' '}
        {SITE.operator} in {SITE.location}. Contact: <ContactEmail />. More detail is on
        the <Link to="/about">About &amp; contact</Link> page.
      </p>

      <h2>2. Legal information, not legal advice</h2>
      <p>
        The site explains, in general terms, what laws and programs say. It cannot apply the law
        to your specific facts, tell you what you should do, predict what a court or agency will
        decide, or represent you. Only a licensed attorney who knows your situation can give you
        legal advice.
      </p>
      <p>
        The operator of this site is not an attorney, and the site is not a law firm, a lawyer
        referral service, or a government agency. No attorney-client relationship is created by
        using the site, asking a question, or emailing us. What you type into the site is not
        confidential in the way a conversation with a lawyer is, and it is not protected by
        attorney-client privilege.
      </p>

      <h2>3. AI-generated answers</h2>
      <p>
        Answers on the “Ask a question” page are generated automatically by an artificial
        intelligence system, using a library of legal-aid guides, statutes, ordinances, and
        program rules, and sometimes a search of approved government and legal-aid websites. No
        lawyer reviews an answer before you see it.
      </p>
      <p>
        AI systems make mistakes. An answer may be wrong, may leave out something that matters,
        may not match your city or state, or may describe a law that has since changed. The
        confidence label and the list of sources are there to help you check an answer; they are
        not a guarantee. Always confirm important information with the original source, a
        lawyer, or a legal aid organization before you act on it.
      </p>

      <h2>4. Deadlines</h2>
      <p>
        Legal deadlines can be short and missing one can have serious consequences. The
        “Deadline helper” only adds days to a date. It does not know when your deadline started,
        whether weekends or court holidays count, or which rule applies to you. Never rely on it,
        or on any answer from this site, as the final word on a deadline. Check your court papers
        and contact a legal aid organization right away.
      </p>

      <h2>5. Where the information applies</h2>
      <p>
        The site is built mainly for people in Illinois. Laws differ from state to state and city
        to city. Coverage of any other state is limited and may be less complete. Information
        about one place may be wrong for another.
      </p>

      <h2>6. Translations</h2>
      <p>
        Translations on this site are machine-assisted and may contain errors. If a translation
        and the English version differ, the English version controls.
      </p>

      <h2>7. Organizations and links</h2>
      <p>
        We list legal aid organizations, government agencies, and other resources to help you
        find assistance. We are not affiliated with, endorsed by, or paid by them, and listing an
        organization is not a recommendation or a promise that it can help you. Phone numbers,
        hours, costs, and eligibility rules change. Confirm them with the organization. We are
        not responsible for the content or services of other websites or organizations.
      </p>

      <h2>8. Cost</h2>
      <p>
        The site is free. We do not charge fees or sell anything. See
        our <Link to="/refunds">Refund Policy</Link>.
      </p>

      <h2>9. Acceptable use</h2>
      <p>When you use the site, you agree not to:</p>
      <ul>
        <li>use it for anything unlawful, or to harass or harm another person;</li>
        <li>enter other people’s private information, or sensitive personal details about yourself that are not needed;</li>
        <li>try to break, overload, or get around the security or usage limits of the site;</li>
        <li>use automated tools to send large numbers of requests or to copy the service in bulk;</li>
        <li>present anything from this site as legal advice or as the work of a lawyer.</li>
      </ul>
      <p>We may limit or block access to protect the service or other people.</p>

      <h2>10. Privacy</h2>
      <p>
        Our <Link to="/privacy">Privacy Policy</Link> and <Link to="/cookies">Cookie Policy</Link>{' '}
        explain what information we handle. Please do not include names, addresses, Social
        Security numbers, case numbers, or account numbers in a question.
      </p>

      <h2>11. Ownership and credits</h2>
      <p>
        The site’s name, design, and original written content belong to the operator. The
        software that runs the site is published as open source under the MIT License at{' '}
        <a href={SITE.repo} target="_blank" rel="noopener noreferrer">our GitHub repository</a>.
        Laws, statutes, and government publications quoted or summarized here belong to the
        public or to their publishers. Materials from other organizations remain the property of
        those organizations; the sources shown with each answer link to the originals. Names and
        trademarks of other organizations are used only to identify them. Credits for icons and
        fonts are on the <Link to="/about">About &amp; contact</Link> page.
      </p>
      <p>
        If you believe something on this site infringes your copyright, or you represent an
        organization and want a listing or source corrected or removed, email <ContactEmail />{' '}
        and we will respond promptly.
      </p>

      <h2>12. No warranties</h2>
      <p>
        The site is provided “as is” and “as available”, without warranties of any kind, whether
        express or implied, including implied warranties of merchantability, fitness for a
        particular purpose, accuracy, and non-infringement. We do not promise that the site will
        be accurate, complete, current, uninterrupted, or error-free.
      </p>

      <h2>13. Limit of liability</h2>
      <p>
        To the fullest extent the law allows, the operator of this site will not be liable for
        any indirect, incidental, special, consequential, or punitive damages, or for any loss
        that results from relying on information from the site, including a missed deadline, a
        lost case, a lost benefit, or lost housing. Because the site is free, to the fullest
        extent the law allows, our total liability for any claim related to the site is limited
        to fifty U.S. dollars (US $50).
      </p>
      <p>
        Some states do not allow certain limits on warranties or liability, so some of these
        limits may not apply to you. Nothing in these terms takes away rights that the law does
        not allow to be waived.
      </p>

      <h2>14. Governing law</h2>
      <p>
        These terms are governed by the laws of the State of Illinois, without regard to its
        conflict-of-law rules. Any dispute about the site or these terms will be brought in the
        state or federal courts located in Cook County, Illinois, unless the law where you live
        gives you the right to bring it elsewhere.
      </p>

      <h2>15. Changes</h2>
      <p>
        We may update these terms. When we do, we will change the date at the top of this page.
        If you keep using the site after a change, you accept the updated terms. We may also
        change, pause, or end the site at any time.
      </p>

      <h2>16. Contact</h2>
      <p>
        Questions about these terms: <ContactEmail />.
      </p>
    </LegalPage>
  )
}
