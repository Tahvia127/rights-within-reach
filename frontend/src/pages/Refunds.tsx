import { Link } from 'react-router-dom'
import { LegalPage, ContactEmail } from '../components/LegalPage'
import { SITE } from '../lib/siteInfo'

// The site takes no payments. If that ever changes (donations, paid features),
// rewrite this page before the first payment is accepted.
export default function Refunds() {
  return (
    <LegalPage
      title="Refund Policy"
      intro="Rights Within Reach is free. We do not charge for anything, so there is nothing to refund."
    >
      <h2>We do not take payments</h2>
      <ul>
        <li>Every part of this site is free to use.</li>
        <li>We do not sell products, services, subscriptions, or documents.</li>
        <li>We do not accept donations through the site.</li>
        <li>We never ask for a credit card, debit card, bank account, or any other payment details.</li>
      </ul>
      <p>Because we never charge you, no refunds are needed or offered.</p>

      <h2>If someone asks you to pay</h2>
      <p>
        If a website, message, or caller uses the name {SITE.name} and asks you for money or
        payment details, it is not us. Do not pay. Please tell us at <ContactEmail />. You can
        also report scams to the Illinois Attorney General’s Consumer Fraud Hotline at{' '}
        <a href="tel:18003865438">1-800-386-5438</a> or to the Federal Trade Commission at{' '}
        <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer">reportfraud.ftc.gov</a>.
      </p>

      <h2>Other organizations</h2>
      <p>
        The organizations listed on our <Link to="/resources">Resources</Link> page are separate
        from us. Most offer free help, but some may charge fees or have their own rules. Any
        payment you make to another organization, and any refund, is between you and that
        organization.
      </p>

      <h2>If this changes</h2>
      <p>
        If we ever begin to accept payments of any kind, we will update this policy before we do.
      </p>
    </LegalPage>
  )
}
