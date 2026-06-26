import { TopicPage } from '../components/TopicPage'

export default function Repairs() {
  return (
    <TopicPage
      parentLabel="Home Repairs"
      eyebrow="Home repairs"
      title="Grants to fix up your home."
      sub="Free and low-cost programs for roof, heating, plumbing, accessibility, and emergency repairs in Illinois."
      iconName="wrench"
      quickNav={[
        { id: 'summary', label: 'Summary' },
        { id: 'questions', label: 'Common questions' },
        { id: 'programs', label: 'Programs' },
        { id: 'action', label: 'What to do' },
        { id: 'help', label: 'Get help' },
      ]}
      summary="Many Illinois homeowners, especially elderly homeowners and those on fixed incomes, live in deteriorating homes because they cannot afford essential repairs. Federal, state, city, and nonprofit programs offer grants and zero-interest loans to fix roofs, replace furnaces, repair plumbing, and add accessibility features. These programs are scattered across many agencies, so this guide brings them together."
      faqs={[
        {
          q: 'I am 65 and need to fix my porch but cannot afford it. Are there programs that help?',
          a: 'Yes. In Chicago, the Department of Family and Support Services runs the Small Accessible Repairs for Seniors program for residents 60 and over who earn up to 80% of area median income. The state IHDA Home Repair Program also serves elderly homeowners up to $45,000 in repairs.',
          source: 'City of Chicago DFSS, Illinois Housing Development Authority',
        },
        {
          q: 'My furnace broke in winter. What emergency help is available?',
          a: 'In Chicago, the Emergency Heating Repair Program offers grants averaging $7,000 for emergency heating system repairs during the cold weather months. LIHEAP also has an emergency furnace component.',
          source: 'City of Chicago Department of Housing, Illinois LIHEAP',
        },
        {
          q: 'I use a wheelchair and need a ramp at my home. Can the city help?',
          a: "Chicago HomeMod, run by the Mayor's Office for People with Disabilities, provides up to $10,000 in accessibility modifications including ramps, grab bars, and bathroom adaptations. UCP Seguin Ramp Up Foundation also builds ramps for free for income-eligible residents.",
          source: 'Chicago MOPD HomeMod Program',
        },
        {
          q: 'What does HAFHR cover?',
          a: 'The Illinois Homeowner Assistance Fund Home Repair Program provides up to $60,000 for critical repairs to households earning at or below 150% of area median income who experienced financial hardship during the pandemic. It covers roof, plumbing, electrical, and lead paint remediation.',
          source: 'Illinois Housing Development Authority',
        },
      ]}
      programs={[
        {
          name: 'Small Accessible Repairs for Seniors (SARFS)',
          amount: 'Grant',
          meta: 'City of Chicago · Age 60+',
          body: 'Grants for Chicago seniors at or below 80% of area median income for small repairs like steps, porches, gutters, ramps, and grab bars. No repayment required.',
          cta: 'Apply via DFSS',
          meta2: 'Chicago residents only',
        },
        {
          name: 'Emergency Heating Repair Program (EHRP)',
          amount: '~$7,000',
          meta: 'City of Chicago · Winter only',
          body: 'Grants for emergency furnace and boiler repairs during heating season. Applications open every fall and serve income-eligible homeowners.',
          cta: 'Apply now',
          meta2: 'Chicago residents only',
        },
        {
          name: 'IHDA Home Repair Program (HRAP)',
          amount: 'Up to $45,000',
          meta: 'Statewide · IHDA',
          body: 'Forgivable loans for health, safety, accessibility, and energy efficiency repairs. Serves low and very low income homeowners across Illinois.',
          cta: 'Apply via IHDA',
          meta2: 'Statewide eligibility',
        },
        {
          name: 'Homeowner Assistance Fund Home Repair (HAFHR)',
          amount: 'Up to $60,000',
          meta: 'Statewide · COVID-related',
          body: 'Up to $60,000 for critical repairs for households at or below 150% AMI who experienced COVID-related financial hardship. Administered through Habitat for Humanity and NHS affiliates.',
          cta: 'Check eligibility',
          meta2: 'Up to 150% AMI',
        },
        {
          name: 'USDA Section 504 Home Repair Program',
          amount: 'Up to $10,000',
          meta: 'Federal · Rural areas',
          body: 'Grants and loans for very low income homeowners in rural areas. Grants are limited to those 62 and older who cannot repay a loan.',
          cta: 'Apply via USDA',
          meta2: 'Rural Illinois only',
        },
        {
          name: 'Chicago HomeMod Program',
          amount: 'Up to $10,000',
          meta: 'City of Chicago · Disability',
          body: 'Accessibility modifications for Chicago residents with disabilities. Covers ramps, lifts, grab bars, accessible bathrooms, and door widening.',
          cta: 'Apply via MOPD',
          meta2: 'Chicago residents only',
        },
      ]}
      steps={[
        { title: 'Start with HAFHR or HRAP.', body: 'These cover the most repair types and the most money. If you qualify, they should be your first applications.' },
        { title: 'Apply for multiple programs at once.', body: 'Programs can be combined in many cases. The earlier you apply, the better your odds before funds run out for the year.' },
        { title: 'Get a written estimate.', body: 'Most programs require at least one contractor estimate. Pick licensed contractors and keep all paperwork.' },
        { title: 'Document the need.', body: 'Take photos of the problem before any work starts. Save any inspector reports or letters from your utility company.' },
        { title: 'If you are 60 or older, ask about senior programs first.', body: 'Programs like SARFS and Section 504 grants are easier to qualify for if you are an elderly homeowner.' },
      ]}
      referral={
        <aside className="referral" aria-label="Featured referral">
          <div className="referral-sticker" aria-hidden="true">★ Start here</div>
          <h3 className="serif referral-title">Chicagoland Habitat for Humanity</h3>
          <div className="referral-org">
            <div className="org-head">
              <div className="org-badge" aria-hidden="true">HB</div>
              <div>
                <p className="serif org-name">HAFHR program administrator</p>
                <p className="org-sub">Helps with the IHDA Homeowner Assistance Fund application</p>
              </div>
            </div>
            <p className="org-desc">Habitat for Humanity is the official administrator for HAFHR in the Chicago region. They help you complete the application, work with contractors, and make sure your repairs meet the program standards.</p>
          </div>
          <div className="org-stats">
            <div className="stat"><p className="stat-label">Website</p><p className="stat-val">chicagolandhabitat.org</p></div>
            <div className="stat"><p className="stat-label">Hours</p><p className="stat-val">Mon–Fri, 9–5</p></div>
          </div>
          <p className="bring-label">Bring these with you</p>
          <ul className="bring-list">
            <li className="bring-chip">Deed to your home</li>
            <li className="bring-chip">Property tax bill</li>
            <li className="bring-chip">Photo ID</li>
            <li className="bring-chip">Proof of income</li>
            <li className="bring-chip">Photos of repairs needed</li>
          </ul>
          <div className="referral-buttons">
            <a href="#" className="btn btn-clover external" target="_blank" rel="noopener" style={{ flex: 1, justifyContent: 'center' }}>
              Start your application →
            </a>
            <button className="btn btn-outline">Find another program</button>
          </div>
        </aside>
      }
    />
  )
}
