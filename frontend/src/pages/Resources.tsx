import { Link } from 'react-router-dom'
import { SkipLink } from '../components/SkipLink'
import { LanguageStrip } from '../components/LanguageStrip'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Icon } from '../lib/icons'

interface ResourceCard {
  name: string
  desc: string
  tag: string
  meta: [string, string]
  href?: string
  featured?: boolean
}

const FEATURED: ResourceCard[] = [
  {
    name: 'Illinois Legal Aid Online — Get Legal Help',
    desc: 'Statewide triage platform. Answer a few questions and they will connect you with a legal aid lawyer near you who handles your type of case.',
    tag: 'Featured',
    meta: ['★ illinoislegalaid.org', '✦ Spanish available'],
    href: 'https://illinoislegalaid.org',
    featured: true,
  },
  {
    name: 'CARPLS Legal Aid Hotline',
    desc: 'Free legal hotline for Cook County residents. Speak with a lawyer about housing, debt, family, consumer, and many other issues.',
    tag: 'Featured',
    meta: ['★ 312-738-9200', '✦ Mon–Fri, 9–4:30'],
    href: 'tel:3127389200',
    featured: true,
  },
]

const HOUSING: ResourceCard[] = [
  { name: "Lawyers' Committee for Better Housing (LCBH)", desc: 'Tenant defense, building code enforcement, and Section 8 voucher protection. Free representation for low-income Chicago renters.', tag: 'Chicago', meta: ['★ lcbh.org', '✦ 312-784-3507'] },
  { name: 'Legal Aid Chicago — Housing Practice', desc: 'Eviction defense, foreclosure prevention, and tenant rights education in Chicago and Cook County.', tag: 'Chicago', meta: ['★ 312-341-1070', '✦ Mon–Fri'] },
  { name: 'Chicago 311', desc: 'Report habitability problems like no heat, no water, pests, or unsafe conditions. Inspector reports are useful evidence.', tag: 'City', meta: ['★ Call 311', '✦ 24/7'], href: 'tel:311' },
  { name: 'Tenants Together Hotline', desc: 'Statewide tenant rights education and advocacy. Free hotline and one-on-one counseling for Illinois renters.', tag: 'Statewide', meta: ['★ Statewide', '✦ Sliding scale'] },
]

const MONEY: ResourceCard[] = [
  { name: 'CFPB Consumer Complaint', desc: 'File a complaint against a debt collector, bank, or other financial company. The CFPB will require them to respond.', tag: 'Federal', meta: ['★ consumerfinance.gov', '✦ 855-411-2372'] },
  { name: 'Illinois Attorney General — Consumer', desc: 'File a consumer complaint about predatory lending, fraud, or unfair business practices in Illinois.', tag: 'Statewide', meta: ['★ illinoisattorneygeneral.gov', '✦ 800-386-5438'] },
  { name: 'LIHEAP — Energy Assistance', desc: 'Pay heating bills and prevent shutoffs. Apply through your local Community Action Agency. Limited funds open each fall.', tag: 'Program', meta: ['★ helpillinoisfamilies.com', '✦ 877-411-9276'] },
  { name: 'Consumer Credit Counseling Services', desc: 'Free or low-cost nonprofit credit counseling, debt management plans, and bankruptcy counseling.', tag: 'Nonprofit', meta: ['★ Find local agency', '✦ Free first session'] },
]

const REPAIRS: ResourceCard[] = [
  { name: 'Illinois Housing Development Authority', desc: 'Administers HAFHR and HRAP home repair grants for low-income homeowners across Illinois. Multiple programs available.', tag: 'Statewide', meta: ['★ ihda.org', '✦ 312-836-5200'] },
  { name: 'City of Chicago — Department of Housing', desc: 'Administers EHRP, the Roof and Porch Program, and the Chicago Home Repair Program. Income-based eligibility.', tag: 'Chicago', meta: ['★ chicago.gov/doh', '✦ 312-744-3653'] },
  { name: 'Rebuilding Together Metro Chicago', desc: 'Volunteer-based home repair for low-income homeowners, seniors, veterans, and people with disabilities. No cost to qualifying homeowners.', tag: 'Nonprofit', meta: ['★ rebuildingtogether-chi.org', '✦ 312-733-3640'] },
  { name: 'Chicago HomeMod (MOPD)', desc: 'Up to $10,000 in accessibility modifications for Chicago residents with disabilities. Ramps, grab bars, accessible bathrooms.', tag: 'Chicago', meta: ['★ chicago.gov/mopd', '✦ 312-744-7050'] },
]

const BENEFITS: ResourceCard[] = [
  { name: 'ABE — Application for Benefits Eligibility', desc: 'The state portal to apply for SNAP, Medicaid, All Kids, TANF, and other benefits in a single application.', tag: 'State', meta: ['★ ABE.illinois.gov', '✦ Apply online'] },
  { name: 'Legal Aid Chicago — Benefits Practice', desc: 'Help with benefits appeals, overpayment cases, and reinstatement. Representation at administrative hearings.', tag: 'Chicago', meta: ['★ 312-341-1070', '✦ Mon–Fri'] },
  { name: 'Greater Chicago Food Depository', desc: 'SNAP outreach, food pantries, and benefits application assistance. Free help completing your SNAP application.', tag: 'Nonprofit', meta: ['★ chicagosfoodbank.org', '✦ 773-247-3663'] },
  { name: 'Illinois DHS Family Community Resource Center', desc: 'In-person assistance with benefits applications, renewals, and case questions. Located in every Illinois county.', tag: 'State', meta: ['★ dhs.state.il.us', '✦ 800-843-6154'] },
]

function ResCard({ card }: { card: ResourceCard }) {
  const className = card.featured ? 'res-card featured' : 'res-card'
  const tagClass = card.featured ? 'res-card-tag featured-tag' : 'res-card-tag'
  const content = (
    <>
      <div className="res-card-head">
        <h3 className="res-card-name">{card.name}</h3>
        <span className={tagClass}>{card.tag}</span>
      </div>
      <p className="res-card-desc">{card.desc}</p>
      <div className="res-card-meta">
        <span>{card.meta[0]}</span>
        <span>{card.meta[1]}</span>
      </div>
    </>
  )
  return card.href ? (
    <a href={card.href} className={className} target="_blank" rel="noopener">{content}</a>
  ) : (
    <div className={className}>{content}</div>
  )
}

export default function Resources() {
  return (
    <>
      <SkipLink />
      <LanguageStrip />
      <SiteHeader />

      <header className="topic-page-hero" role="banner">
        <div className="topic-page-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link> · Resources
          </nav>
          <div className="topic-hero-row">
            <div className="topic-hero-icon-wrap" aria-hidden="true">
              <Icon name="phone-ringing" size={36} />
            </div>
            <div>
              <p className="eyebrow">Find help</p>
              <h1 className="serif topic-page-title">Real people who can help.</h1>
            </div>
          </div>
          <p className="topic-page-sub">Every organization on this page provides free or sliding-scale legal help to Illinois residents. Most have multilingual staff. None will charge you for a consultation.</p>
        </div>
      </header>

      <main id="main">

        <section className="section section-cream" aria-labelledby="start-here">
          <div className="section-inner">
            <p className="eyebrow">If you need help now</p>
            <h2 id="start-here" className="serif section-title">Start here, no matter what your problem is.</h2>
            <p className="section-sub">If you are not sure who to call, these two organizations triage you to the right place.</p>
            <div className="res-grid">
              {FEATURED.map((c, i) => <ResCard key={i} card={c} />)}
            </div>
          </div>
        </section>

        <section className="res-section" aria-labelledby="housing-orgs">
          <div className="res-section-inner">
            <p className="eyebrow">Housing & eviction</p>
            <h2 id="housing-orgs" className="serif res-cat-title">Get help with rent, eviction, repairs, and deposits.</h2>
            <div className="res-grid">
              {HOUSING.map((c, i) => <ResCard key={i} card={c} />)}
            </div>
          </div>
        </section>

        <section className="res-section" aria-labelledby="money-orgs">
          <div className="res-section-inner">
            <p className="eyebrow">Money & debt</p>
            <h2 id="money-orgs" className="serif res-cat-title">Help with debt, garnishment, and utilities.</h2>
            <div className="res-grid">
              {MONEY.map((c, i) => <ResCard key={i} card={c} />)}
            </div>
          </div>
        </section>

        <section className="res-section" aria-labelledby="repair-orgs">
          <div className="res-section-inner">
            <p className="eyebrow">Home repairs</p>
            <h2 id="repair-orgs" className="serif res-cat-title">Apply for grants to fix your home.</h2>
            <div className="res-grid">
              {REPAIRS.map((c, i) => <ResCard key={i} card={c} />)}
            </div>
          </div>
        </section>

        <section className="res-section" aria-labelledby="benefits-orgs">
          <div className="res-section-inner">
            <p className="eyebrow">Public benefits</p>
            <h2 id="benefits-orgs" className="serif res-cat-title">Apply for, appeal, or restore your benefits.</h2>
            <div className="res-grid">
              {BENEFITS.map((c, i) => <ResCard key={i} card={c} />)}
            </div>
          </div>
        </section>

        <section className="section section-cream" aria-labelledby="today-list">
          <div className="section-inner">
            <p className="eyebrow">What to do right now</p>
            <h2 id="today-list" className="serif section-title">Five things to do today.</h2>
            <p className="section-sub">If you are facing a legal problem, doing these five things in the next 24 hours will protect your rights and make it easier to get help.</p>

            <ol className="step-list">
              <li><strong>Take photos of everything.</strong>Any letter, notice, condition, or damage that matters to your case. Photos are evidence.</li>
              <li><strong>Write down the dates.</strong>When did the problem start? When did you tell someone? When did they respond? Specific dates matter in court.</li>
              <li><strong>Save every piece of paper.</strong>Notices, bills, leases, letters, and texts. Put them in one folder you can grab quickly.</li>
              <li><strong>Call one of the legal aid organizations on this page.</strong>Do not wait for a court date. Call now, even if you think your case is too small. Most consultations are free.</li>
              <li><strong>Do not sign anything you do not understand.</strong>If your landlord, debt collector, or employer asks you to sign something, take a copy home first and ask a lawyer.</li>
            </ol>

            <div className="callout callout-burgundy" style={{ marginTop: '1.8rem' }}>
              <p className="callout-label">★ Important</p>
              <p>If you are in immediate danger or your situation is urgent, do not wait. Call 911 for emergencies, or 311 for serious living conditions in Chicago. For an eviction filed against you, contact a legal aid organization within 24 hours.</p>
            </div>
          </div>
        </section>

        <section className="section section-bone" aria-labelledby="bring-list">
          <div className="section-inner">
            <p className="eyebrow">What to bring</p>
            <h2 id="bring-list" className="serif section-title">Prepare for your first legal aid meeting.</h2>
            <p className="section-sub">Most consultations only last 30 minutes. Bring the right documents and you will get more out of the meeting.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <BringCard title="For housing issues" meta="Eviction, deposits, repairs" items={['Your lease (every page)', 'Any notices from your landlord', 'Photos of any conditions or damage', 'Rent receipts or proof of payment', 'Photo ID']} />
              <BringCard title="For debt or consumer issues" meta="Garnishment, collection, utilities" items={['Account statements', 'Collection letters or notices', 'A log of calls (date, time, what said)', 'Pay stubs and proof of income', 'Photo ID']} />
              <BringCard title="For home repair grants" meta="HAFHR, HRAP, city programs" items={['Deed to your home', 'Property tax bill', 'Proof of income for all adults', 'Photos of needed repairs', 'Contractor estimates if you have them']} />
              <BringCard title="For benefits issues" meta="SNAP, Medicaid, All Kids" items={['Denial or termination letter', 'Application copy', 'Proof of income', 'Photo ID and Social Security cards', 'Birth certificates for children']} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}

function BringCard({ title, meta, items }: { title: string; meta: string; items: string[] }) {
  return (
    <article className="program-card">
      <h3 className="program-name">{title}</h3>
      <p className="program-meta">{meta}</p>
      <ul style={{ paddingLeft: '1.3rem', fontSize: '1rem', lineHeight: 1.7 }}>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </article>
  )
}
