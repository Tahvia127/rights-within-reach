import { TopicPage } from '../components/TopicPage'

export default function Benefits() {
  return (
    <TopicPage
      parentLabel="Public Benefits"
      eyebrow="Public benefits"
      title="SNAP, Medicaid, and other support."
      sub="Eligibility, how to apply, and what to do if you have been denied or your benefits were cut off."
      iconName="benefits"
      quickNav={[
        { id: 'summary', label: 'Summary' },
        { id: 'questions', label: 'Common questions' },
        { id: 'programs', label: 'Programs' },
        { id: 'action', label: 'What to do' },
        { id: 'help', label: 'Get help' },
      ]}
      summary="Public benefits like SNAP (food), Medicaid (health care), All Kids (children's coverage), and energy assistance help millions of Illinois residents make ends meet. Eligibility rules can be complicated, but the rules themselves are public and rooted in the Illinois Public Aid Code and federal regulations. If you are denied or cut off, you have the right to appeal."
      faqs={[
        {
          q: 'Who qualifies for SNAP in Illinois?',
          a: 'In Illinois, most households with gross monthly income below 200% of the federal poverty level qualify. For a household of 1, that is about $2,510 per month in 2025. Households with elderly or disabled members have higher limits. Households on TANF or SSI are automatically eligible.',
          source: 'Illinois Department of Human Services, 89 Ill. Adm. Code 121',
        },
        {
          q: 'Can immigrants apply for Medicaid in Illinois?',
          a: 'Most lawful permanent residents qualify after 5 years. Children and pregnant people qualify regardless of immigration status under All Kids and Moms & Babies. Emergency Medicaid covers life-threatening emergencies for everyone regardless of status.',
          source: 'Illinois Public Aid Code, 305 ILCS 5',
        },
        {
          q: 'How do I apply for All Kids?',
          a: 'You can apply online at ABE.illinois.gov, by phone, in person at a Family Community Resource Center, or by mail. All Kids covers all children in Illinois regardless of immigration status, with low or no monthly premiums based on family income.',
          source: 'Illinois All Kids Program',
        },
        {
          q: 'My SNAP benefits were cut off. Can I appeal?',
          a: 'Yes. You have 90 days from the date of the notice to request an appeal hearing. If you appeal within 10 days, your benefits continue during the appeal. You have a right to free legal help at the hearing.',
          source: 'IDHS Appeal Rights, 89 Ill. Adm. Code 14',
        },
      ]}
      programs={[
        {
          name: 'SNAP — Supplemental Nutrition Assistance Program',
          amount: 'Monthly',
          meta: 'Federal/state · Income-based',
          body: 'Provides a monthly benefit on an EBT card for groceries. Benefit amount depends on household size and income. You can apply online at ABE.illinois.gov.',
          cta: 'Apply for SNAP',
          meta2: 'Up to 200% of poverty level',
        },
        {
          name: 'Medicaid for Adults',
          amount: 'Free coverage',
          meta: 'Federal/state · Income-based',
          body: 'Health insurance for adults up to 138% of federal poverty level. Covers doctor visits, prescriptions, hospital care, mental health, and more. No monthly premium for most enrollees.',
          cta: 'Apply for Medicaid',
          meta2: 'Up to 138% of poverty level',
        },
        {
          name: 'All Kids',
          amount: 'Low premium',
          meta: 'State of Illinois · Children only',
          body: 'Health coverage for all children in Illinois regardless of immigration status. Premiums range from $0 to $80 per month per child based on income. Covers doctor visits, dental, vision, prescriptions, and more.',
          cta: 'Apply for All Kids',
          meta2: 'All Illinois children',
        },
        {
          name: 'TANF — Temporary Assistance for Needy Families',
          amount: 'Monthly cash',
          meta: 'Federal/state · Families with children',
          body: 'Cash assistance for low-income families with children. Comes with work requirements and time limits. Often combined with SNAP and Medicaid.',
          cta: 'Apply for TANF',
          meta2: 'Lifetime 60-month limit',
        },
        {
          name: 'WIC — Women, Infants, and Children',
          amount: 'Food benefits',
          meta: 'Federal · Pregnant + young children',
          body: 'Nutrition support for pregnant women, new mothers, and children up to age 5. Available regardless of immigration status. Income limit up to 185% of poverty level.',
          cta: 'Apply for WIC',
          meta2: 'Birth to age 5',
        },
      ]}
      steps={[
        { title: 'Apply for everything at once.', body: 'ABE.illinois.gov lets you apply for SNAP, Medicaid, All Kids, TANF, and other benefits in a single application. There is no penalty for applying.' },
        { title: 'Keep your case worker informed.', body: 'If your address, income, or family changes, report it within 10 days. Failure to report can lead to overpayment claims later.' },
        { title: 'Save every letter from IDHS.', body: 'Notices have deadlines and appeal rights printed on them. Missing a 10-day window can mean losing benefits during an appeal.' },
        { title: 'Appeal denials immediately.', body: 'If you are denied, appeal within 10 days to keep your benefits running during the appeal. You have 90 days total, but the 10-day window protects current benefits.' },
        { title: 'Get free help with the application.', body: 'Community organizations and federally qualified health centers offer free help with benefits applications. You do not have to navigate ABE alone.' },
      ]}
      referral={
        <aside className="referral" aria-label="Featured referral">
          <div className="referral-sticker" aria-hidden="true">★ Start here</div>
          <h3 className="serif referral-title">Legal Aid Chicago — Public Benefits Practice</h3>
          <div className="referral-org">
            <div className="org-head">
              <div className="org-badge" aria-hidden="true">LA</div>
              <div>
                <p className="serif org-name">Legal Aid Chicago</p>
                <p className="org-sub">Public benefits, appeals, and reinstatement</p>
              </div>
            </div>
            <p className="org-desc">Legal Aid Chicago helps Illinois residents who have been denied or cut off from SNAP, Medicaid, TANF, or other benefits. They represent clients at appeal hearings and help with the application process for free.</p>
          </div>
          <div className="org-stats">
            <div className="stat"><p className="stat-label">Phone</p><p className="stat-val"><a href="tel:3123411070">312-341-1070</a></p></div>
            <div className="stat"><p className="stat-label">Hours</p><p className="stat-val">Mon–Fri, 9–5</p></div>
          </div>
          <p className="bring-label">Bring these with you</p>
          <ul className="bring-list">
            <li className="bring-chip">Denial letter</li>
            <li className="bring-chip">Photo ID</li>
            <li className="bring-chip">Proof of income</li>
            <li className="bring-chip">Social Security cards</li>
            <li className="bring-chip">Application copy</li>
          </ul>
          <div className="referral-buttons">
            <a href="tel:3123411070" className="btn btn-clover" style={{ flex: 1, justifyContent: 'center' }}>
              Call Legal Aid Chicago →
            </a>
            <button className="btn btn-outline">Find another org</button>
          </div>
        </aside>
      }
    />
  )
}
