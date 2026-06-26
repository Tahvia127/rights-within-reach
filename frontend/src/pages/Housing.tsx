import { TopicPage } from '../components/TopicPage'

export default function Housing() {
  return (
    <TopicPage
      parentLabel="Housing & Rent"
      eyebrow="Housing & rent"
      title="Your rights as a tenant in Illinois."
      sub="Eviction, rent increases, security deposits, repairs, and what to do if your landlord breaks the rules."
      iconName="home"
      quickNav={[
        { id: 'summary', label: 'Summary' },
        { id: 'questions', label: 'Common questions' },
        { id: 'programs', label: 'Rules & protections' },
        { id: 'action', label: 'What to do' },
        { id: 'help', label: 'Get help' },
      ]}
      summary={
        <>
          In Chicago, tenants are protected by the Residential Landlord and Tenant Ordinance (<abbr title="Residential Landlord and Tenant Ordinance">RLTO</abbr>) and the Fair Notice Ordinance. These rules cover how much notice your landlord must give before raising rent or ending your lease, how security deposits must be handled, what landlords must do to keep your home livable, and what you can do if they break the rules. Outside Chicago, Illinois state law sets minimum standards but offers fewer specific protections.
        </>
      }
      faqs={[
        {
          q: 'How much notice does my landlord need to give to raise my rent?',
          a: 'In Chicago, written notice must be given 30 days in advance if you have lived there less than 6 months, 60 days if 6 months to 3 years, and 120 days if more than 3 years. Outside Chicago, Illinois state law requires 30 days notice for month-to-month tenancies.',
          source: 'Chicago RLTO §5-12-130 and Chicago Fair Notice Ordinance',
        },
        {
          q: 'My landlord has not returned my security deposit. What can I do?',
          a: 'Illinois law requires deposits to be returned within 30 days for itemized deductions, or 45 days if no deductions. If your landlord fails to do this, you may be entitled to twice the deposit amount plus court costs and attorney fees.',
          source: 'Illinois Security Deposit Return Act',
        },
        {
          q: 'There is no heat in my apartment. Does my landlord have to fix it?',
          a: 'Yes. In Chicago, landlords must provide heat from September 15 through June 1, with minimum temperatures of 68 degrees during the day and 66 degrees at night. If your landlord fails to provide heat, you can call 311, withhold rent in some cases, or sue for damages.',
          source: 'Chicago Municipal Code 5-12-110',
        },
        {
          q: 'My landlord wants to evict me. How long does the process take?',
          a: 'Generally, evictions in Illinois take between 30 and 90 days from start to finish. Your landlord must first give you written notice (5, 10, or 30 days depending on the reason), then file a court case, and then get a judgment from a judge before the sheriff can remove you. You cannot be locked out without a court order.',
          source: 'Illinois Eviction Act, 735 ILCS 5/9-101',
        },
      ]}
      programs={[
        {
          name: 'Chicago Residential Landlord and Tenant Ordinance (RLTO)',
          amount: 'Chicago',
          meta: 'Chicago Municipal Code §5-12',
          body: 'The RLTO is the main law that protects renters in Chicago. It covers security deposits, repairs, heat requirements, landlord access rules, lease termination, and tenant remedies. It applies to almost all rental units in the city, with a few exceptions for owner-occupied buildings of 6 units or fewer.',
          cta: 'Read the RLTO',
          meta2: 'Applies to most Chicago rentals',
        },
        {
          name: 'Chicago Fair Notice Ordinance',
          amount: 'Chicago',
          meta: 'Effective July 2020',
          body: 'This ordinance requires longer notice periods before a landlord can raise rent or end a lease, depending on how long you have lived there. It is meant to give tenants more time to find a new place if they cannot afford an increase.',
          cta: 'Learn more',
          meta2: '30 / 60 / 120 day notice rules',
        },
        {
          name: 'Illinois Eviction Act',
          amount: 'Statewide',
          meta: '735 ILCS 5/9',
          body: 'This state law governs how evictions must proceed. It requires landlords to give written notice, file a court case, and get a judgment before any tenant can be removed. Self-help evictions like changing the locks or shutting off utilities are illegal.',
          cta: 'Read the statute',
          meta2: 'All of Illinois',
        },
      ]}
      steps={[
        { title: 'Document everything in writing.', body: 'Take photos, save text messages, and write down dates of any conversations. Keep copies of every notice your landlord gives you.' },
        { title: 'Send written notice yourself.', body: 'If your landlord is not fixing a repair, write a dated letter (keep a copy) describing the problem and giving them a reasonable time to fix it.' },
        { title: 'Call 311 for habitability issues.', body: 'In Chicago, 311 can dispatch a building inspector for issues like no heat, mold, pests, or unsafe conditions. The inspection report can support your case later.' },
        { title: 'Do not pay cash without a receipt.', body: 'If you must pay rent in cash, always get a signed and dated receipt. This protects you if your landlord later claims you did not pay.' },
        { title: 'Get free legal help before things escalate.', body: 'Do not wait until you are in court. Call a legal aid organization as soon as a problem starts so they can help you respond correctly.' },
      ]}
      referral={
        <aside className="referral" aria-label="Featured referral">
          <div className="referral-sticker" aria-hidden="true">★ Start here</div>
          <h3 className="serif referral-title">Illinois Legal Aid Online — Get Legal Help</h3>
          <div className="referral-org">
            <div className="org-head">
              <div className="org-badge" aria-hidden="true">IL</div>
              <div>
                <p className="serif org-name">Statewide referral platform</p>
                <p className="org-sub">Routes you to the right legal aid lawyer for your case</p>
              </div>
            </div>
            <p className="org-desc">Answer a few questions and ILAO will connect you with a free legal aid attorney near you. They handle eviction, repairs, security deposits, and more. Available in English and Spanish.</p>
          </div>
          <div className="org-stats">
            <div className="stat"><p className="stat-label">Website</p><p className="stat-val">illinoislegalaid.org</p></div>
            <div className="stat"><p className="stat-label">Phone</p><p className="stat-val">311 in Chicago</p></div>
          </div>
          <p className="bring-label">Bring these with you</p>
          <ul className="bring-list">
            <li className="bring-chip">Your lease</li>
            <li className="bring-chip">Any notices you got</li>
            <li className="bring-chip">Photo ID</li>
            <li className="bring-chip">Photos of problems</li>
            <li className="bring-chip">Rent receipts</li>
          </ul>
          <div className="referral-buttons">
            <a href="https://illinoislegalaid.org" className="btn btn-clover external" target="_blank" rel="noopener" style={{ flex: 1, justifyContent: 'center' }}>
              Start with ILAO →
            </a>
            <button className="btn btn-outline">See other orgs</button>
          </div>
        </aside>
      }
    />
  )
}
