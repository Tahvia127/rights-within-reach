import { TopicPage } from '../components/TopicPage'

export default function Money() {
  return (
    <TopicPage
      parentLabel="Money & Debt"
      eyebrow="Money & debt"
      title="Your rights with debt, wages, and utilities."
      sub="Wage garnishment, debt collector harassment, utility shutoffs, predatory loans, and how to push back."
      iconName="money"
      quickNav={[
        { id: 'summary', label: 'Summary' },
        { id: 'questions', label: 'Common questions' },
        { id: 'programs', label: 'Key laws' },
        { id: 'action', label: 'What to do' },
        { id: 'help', label: 'Get help' },
      ]}
      summary="Many of the same crises that lead to eviction also lead to debt: medical bills, lost income, unpaid utilities. Illinois and federal law give consumers real protections against debt collector harassment, illegal wage garnishment, and predatory lending. Knowing these rules can prevent a financial crisis from becoming a housing crisis."
      faqs={[
        {
          q: 'How much of my paycheck can be garnished in Illinois?',
          a: 'Illinois law limits wage garnishment to the lesser of 15% of your gross weekly wages, or the amount by which your weekly wages exceed 45 times the state minimum wage. Some types of income are fully exempt, including most public benefits.',
          source: 'Illinois Wage Deduction Act, 735 ILCS 5/12-803',
        },
        {
          q: 'Can my utility be shut off in winter?',
          a: 'Generally, no, if you meet certain conditions. Under Illinois Commerce Commission rules, gas and electric service cannot be disconnected between December 1 and March 31 for households who qualify, have applied for LIHEAP, or are seriously ill.',
          source: 'Illinois Commerce Commission 83 IAC 280',
        },
        {
          q: 'What is the most a payday lender can charge in Illinois?',
          a: 'Under the Illinois Predatory Loan Prevention Act, no consumer loan can carry an annual percentage rate over 36%. Loans that exceed this rate are illegal and unenforceable in Illinois.',
          source: 'Illinois Predatory Loan Prevention Act',
        },
        {
          q: 'A debt collector keeps calling. Are there limits?',
          a: 'Yes. Debt collectors cannot call before 8 a.m. or after 9 p.m. They cannot threaten you, use obscene language, or call your workplace after you tell them to stop. They must verify the debt in writing if you request it within 30 days.',
          source: 'Fair Debt Collection Practices Act, 15 USC §1692',
        },
      ]}
      programs={[
        {
          name: 'Fair Debt Collection Practices Act (FDCPA)',
          amount: 'Federal',
          meta: '15 USC §1692',
          body: 'This federal law limits when and how debt collectors can contact you. It prohibits harassment, false statements, and unfair practices. You can sue for violations and recover damages plus attorney fees.',
          cta: 'Read the law',
          meta2: 'Applies in all 50 states',
        },
        {
          name: 'Illinois Wage Deduction Act',
          amount: 'Statewide',
          meta: '735 ILCS 5/12-803',
          body: 'Limits how much of your wages can be garnished and protects certain types of income entirely. Many public benefits like SNAP, SSI, and Social Security are fully exempt from garnishment.',
          cta: 'Read the law',
          meta2: 'Garnishment limits in Illinois',
        },
        {
          name: 'LIHEAP — Low Income Home Energy Assistance Program',
          amount: 'Up to $1,000+',
          meta: 'Federal/state program',
          body: 'LIHEAP helps low-income households pay heating and cooling bills. It can prevent utility shutoffs, restore service that was cut off, or pay for emergency repairs. Application opens annually in October.',
          cta: 'Apply for LIHEAP',
          meta2: 'Income-based eligibility',
        },
      ]}
      steps={[
        { title: 'Demand verification in writing.', body: 'When a debt collector first contacts you, send a written request for verification within 30 days. They must pause collection until they provide proof.' },
        { title: 'Know what is exempt from garnishment.', body: 'Social Security, SSI, SNAP, and certain other benefits are exempt by law. Banks must protect 2 months of these deposits in your account.' },
        { title: 'Apply for LIHEAP early.', body: 'Funds are limited and run out. Apply as soon as the program opens, even if you are not yet behind on bills.' },
        { title: 'Set up a payment plan before shutoff.', body: 'Utility companies in Illinois are required to offer deferred payment plans if you ask. Calling before a shutoff notice arrives is much easier than after.' },
        { title: 'Talk to a free credit counselor.', body: 'Nonprofit credit counselors can review your debts and help you negotiate. Avoid for-profit debt settlement companies that charge fees up front.' },
      ]}
      referral={
        <aside className="referral" aria-label="Featured referral">
          <div className="referral-sticker" aria-hidden="true">★ Start here</div>
          <h3 className="serif referral-title">CARPLS — Free Legal Aid Hotline</h3>
          <div className="referral-org">
            <div className="org-head">
              <div className="org-badge" aria-hidden="true">CP</div>
              <div>
                <p className="serif org-name">Cook County legal hotline</p>
                <p className="org-sub">Free advice on debt, consumer issues, and more</p>
              </div>
            </div>
            <p className="org-desc">Call to speak with a lawyer about debt collection, garnishment, or utility shutoffs. CARPLS handles thousands of consumer cases each year and can tell you whether a collector is breaking the law.</p>
          </div>
          <div className="org-stats">
            <div className="stat"><p className="stat-label">Phone</p><p className="stat-val"><a href="tel:3127389200">312-738-9200</a></p></div>
            <div className="stat"><p className="stat-label">Hours</p><p className="stat-val">Mon–Fri, 9–4:30</p></div>
          </div>
          <p className="bring-label">Have these ready</p>
          <ul className="bring-list">
            <li className="bring-chip">Account statements</li>
            <li className="bring-chip">Collection letters</li>
            <li className="bring-chip">A call log</li>
            <li className="bring-chip">Pay stubs</li>
          </ul>
          <div className="referral-buttons">
            <a href="tel:3127389200" className="btn btn-clover" style={{ flex: 1, justifyContent: 'center' }}>
              Call CARPLS →
            </a>
            <button className="btn btn-outline">See other orgs</button>
          </div>
        </aside>
      }
    />
  )
}
