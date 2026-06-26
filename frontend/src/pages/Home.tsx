import { useNavigate, Link } from 'react-router-dom'
import { SkipLink } from '../components/SkipLink'
import { LanguageStrip } from '../components/LanguageStrip'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Ticker } from '../components/Ticker'
import { Icon } from '../lib/icons'

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <SkipLink />
      <LanguageStrip />
      <SiteHeader />

      <main id="main">

        <section className="hero" aria-labelledby="hero-title">
          <svg className="deco-star" width="42" height="42" viewBox="0 0 38 38" style={{ top: '2.5rem', right: '22rem' }} aria-hidden="true">
            <path d="M 19 4 L 21 17 L 34 19 L 21 21 L 19 34 L 17 21 L 4 19 L 17 17 Z" fill="#6B1F2E"/>
          </svg>
          <svg className="deco-star" width="26" height="26" viewBox="0 0 22 22" style={{ bottom: '4rem', left: '50%' }} aria-hidden="true">
            <path d="M 11 2 L 12 10 L 20 11 L 12 12 L 11 20 L 10 12 L 2 11 L 10 10 Z" fill="#3D6B3A"/>
          </svg>
          <div className="hero-inner">
            <div>
              <p className="eyebrow">For Illinois residents</p>
              <h1 id="hero-title" className="serif hero-title">Know your<br/>rights.</h1>
              <p className="hero-sub">Free, plain-language information about housing, money, repairs, and benefits. In your language.</p>
              <div className="hero-buttons">
                <button className="btn btn-midnight" onClick={() => navigate('/chat')}>Start asking</button>
                <button className="btn btn-outline" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  How it works
                </button>
              </div>
            </div>
            <div className="hero-decor" aria-hidden="true">
              <svg viewBox="0 0 240 240" style={{ width: '100%', height: '17rem' }}>
                <ellipse cx="118" cy="108" rx="108" ry="80" fill="#6B1F2E"/>
                <path d="M 78 168 L 86 196 L 102 172 Z" fill="#6B1F2E"/>
                <text x="118" y="88" textAnchor="middle" fill="#F3EBE0" fontFamily="Fraunces, serif" fontWeight="700" fontSize="20" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>"Can my</text>
                <text x="118" y="116" textAnchor="middle" fill="#F3EBE0" fontFamily="Fraunces, serif" fontWeight="700" fontSize="20" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>landlord do</text>
                <text x="118" y="144" textAnchor="middle" fill="#F3EBE0" fontFamily="Fraunces, serif" fontWeight="700" fontSize="20" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>that?"</text>
              </svg>
              <div className="sticker sticker-1">100% Free</div>
              <div className="sticker sticker-2">Cited from law</div>
              <div className="sticker sticker-3">5 Languages</div>
            </div>
          </div>
        </section>

        <Ticker />

        <section className="section section-bone" aria-labelledby="about-title">
          <div className="section-inner">
            <p className="eyebrow">What is Rights Within Reach?</p>
            <h2 id="about-title" className="serif section-title">A free tool that meets you where you are.</h2>
            <p className="section-sub">When you are facing an eviction notice, a debt collector call, or a broken furnace, you do not have hours to search government websites. Rights Within Reach is a free chatbot that answers your legal questions in plain language and points you to the people who can help.</p>

            <div className="about-grid">
              <div className="about-text">
                <p><strong>We are not a lawyer.</strong> We are a tool that takes the law and translates it into plain language anyone can understand. Every answer cites the actual statute it comes from, and every answer ends with a referral to a real legal aid organization that can help with your specific case.</p>
                <p><strong>We are built for Illinois.</strong> Every answer is grounded in Illinois statutes, Chicago ordinances, federal benefits rules, and program guidelines. We cover housing and eviction, debt and utilities, home repair grants, and public benefits like <abbr title="Supplemental Nutrition Assistance Program">SNAP</abbr> and Medicaid.</p>
                <p><strong>We are built for everyone.</strong> Our interface works on a low-end phone over slow internet. Every page reads aloud. You can switch to Spanish, Chinese, Tagalog, or Vietnamese any time. You can make the text bigger with one button. We collect no personal information.</p>
                <p><strong>We were built with care.</strong> Rights Within Reach was created at the University of Chicago Tech Showcase in partnership with Illinois Legal Aid Online, the Lawyers' Committee for Better Housing, and the Stanford Legal Design Lab.</p>
              </div>
              <div>
                <div className="fact-card">
                  <p className="fact-label">Sources</p>
                  <p className="fact-value">Illinois statutes, Chicago ordinances, federal guidance, and program documentation</p>
                </div>
                <div className="fact-card">
                  <p className="fact-label">Languages</p>
                  <p className="fact-value">English, Spanish, Chinese, Tagalog, and Vietnamese</p>
                </div>
                <div className="fact-card">
                  <p className="fact-label">Categories</p>
                  <p className="fact-value">Housing, money and debt, home repairs, and public benefits</p>
                </div>
                <div className="fact-card">
                  <p className="fact-label">Cost</p>
                  <p className="fact-value">Always free. No login. No personal information collected.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-cream" id="how-it-works" aria-labelledby="how-title">
          <div className="section-inner">
            <p className="eyebrow">How the chatbot works</p>
            <h2 id="how-title" className="serif section-title">Ask in your own words. Get a clear answer.</h2>
            <p className="section-sub">You do not need to know legal words. You do not need to know which law applies. You just need to ask. Here is what happens after you type your question.</p>

            <ol className="steps-grid" style={{ listStyle: 'none', padding: 0 }}>
              <li className="step-card">
                <span className="step-number" aria-hidden="true">1</span>
                <Icon name="chat" size={36} className="step-icon" />
                <h3 className="serif step-title">You ask</h3>
                <p className="step-desc">Type your question in your own words. "Can my landlord raise the rent?" works. So does "my furnace broke and I am cold."</p>
              </li>
              <li className="step-card">
                <span className="step-number" aria-hidden="true">2</span>
                <Icon name="book" size={36} className="step-icon" />
                <h3 className="serif step-title">We find the law</h3>
                <p className="step-desc">We search the actual Illinois statutes, Chicago ordinances, or program rules that apply to your question.</p>
              </li>
              <li className="step-card">
                <span className="step-number" aria-hidden="true">3</span>
                <Icon name="check" size={36} className="step-icon" />
                <h3 className="serif step-title">You get a clear answer</h3>
                <p className="step-desc">We give you a plain-language answer with the exact law cited, so you can verify it yourself or show it to a lawyer.</p>
              </li>
              <li className="step-card">
                <span className="step-number" aria-hidden="true">4</span>
                <Icon name="phone-ringing" size={36} className="step-icon" />
                <h3 className="serif step-title">You find help</h3>
                <p className="step-desc">Every answer ends with a real legal aid organization you can call for help with your specific situation.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="section section-bone" aria-labelledby="walkthrough-title">
          <div className="section-inner">
            <p className="eyebrow">How to use this site</p>
            <h2 id="walkthrough-title" className="serif section-title">Five steps from question to help.</h2>
            <p className="section-sub">Whether you are facing an emergency or just curious about your rights, here is how to get the most from Rights Within Reach.</p>

            <ol className="step-list">
              <li><strong>Pick a language.</strong>The bar at the top of every page lets you switch between English, Spanish, Chinese, Tagalog, and Vietnamese. The whole site changes, not just the menu.</li>
              <li><strong>Pick a topic, or just start typing.</strong>You can either pick one of the four topic cards on this page, or jump straight to the chatbot and ask anything.</li>
              <li><strong>Read the short answer.</strong>The chatbot gives you a clear answer with the actual law it comes from. Big numbers and key dates are pulled out so you can scan them quickly.</li>
              <li><strong>Tap to read more.</strong>Every answer links to a full topic page with deeper information, common questions, and the full list of programs or rules that apply.</li>
              <li><strong>Get connected to a real person.</strong>Every answer and every topic page ends with one or more legal aid organizations you can call for help. We tell you their phone number, their hours, and what to bring.</li>
            </ol>
          </div>
        </section>

        <section className="section section-cream" aria-labelledby="topics-title">
          <div className="section-inner">
            <p className="eyebrow">Choose a topic</p>
            <h2 id="topics-title" className="serif section-title">What can we help with?</h2>

            <div className="topic-grid">
              <Link to="/housing" className="topic-card" aria-label="Housing and rent topic, most asked">
                <span className="badge most-asked">Most asked</span>
                <Icon name="home" size={28} className="topic-icon" />
                <h3 className="serif topic-title">Housing &amp; rent</h3>
                <p className="topic-desc">Eviction, deposits, repairs, leases, rent increases</p>
                <p className="topic-cta">Read more →</p>
              </Link>
              <Link to="/money" className="topic-card">
                <Icon name="money" size={28} className="topic-icon" />
                <h3 className="serif topic-title">Money &amp; debt</h3>
                <p className="topic-desc">Wages, utilities, debt collectors, garnishment</p>
                <p className="topic-cta">Read more →</p>
              </Link>
              <Link to="/repairs" className="topic-card">
                <Icon name="wrench" size={28} className="topic-icon" />
                <h3 className="serif topic-title">Home repairs</h3>
                <p className="topic-desc">Grants for roof, heating, plumbing, accessibility</p>
                <p className="topic-cta">Read more →</p>
              </Link>
              <Link to="/benefits" className="topic-card" aria-label="Public benefits topic, new">
                <span className="badge new">New</span>
                <Icon name="benefits" size={28} className="topic-icon" />
                <h3 className="serif topic-title">Public benefits</h3>
                <p className="topic-desc">SNAP, Medicaid, All Kids, energy assistance</p>
                <p className="topic-cta">Read more →</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="section section-midnight" aria-labelledby="partners-title">
          <div className="section-inner">
            <p className="eyebrow">Built in partnership with</p>
            <h2 id="partners-title" className="serif" style={{ fontSize: '2.1rem', margin: '0 0 1.4rem' }}>Real legal aid organizations across Illinois.</h2>
            <p style={{ fontSize: '1.08rem', lineHeight: 1.55, maxWidth: '45rem', opacity: 0.88 }}>
              Every answer in Rights Within Reach has been shaped by feedback from practicing attorneys and content directors at organizations that serve Illinois residents every day. Their guidance keeps us honest about what we can and cannot do.
            </p>
            <ul style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1.7rem 0 0', padding: 0, listStyle: 'none', fontFamily: "'Fraunces', Georgia, serif", fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1", fontWeight: 700, fontSize: '1rem', opacity: 0.92 }}>
              <li style={{ padding: '0.6rem 1.1rem', background: 'rgba(243,235,224,0.1)', borderRadius: '50px' }}>Illinois Legal Aid Online</li>
              <li style={{ padding: '0.6rem 1.1rem', background: 'rgba(243,235,224,0.1)', borderRadius: '50px' }}>Lawyers' Committee for Better Housing</li>
              <li style={{ padding: '0.6rem 1.1rem', background: 'rgba(243,235,224,0.1)', borderRadius: '50px' }}>Stanford Legal Design Lab</li>
              <li style={{ padding: '0.6rem 1.1rem', background: 'rgba(243,235,224,0.1)', borderRadius: '50px' }}>CARPLS</li>
              <li style={{ padding: '0.6rem 1.1rem', background: 'rgba(243,235,224,0.1)', borderRadius: '50px' }}>UChicago Tech Showcase</li>
            </ul>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
