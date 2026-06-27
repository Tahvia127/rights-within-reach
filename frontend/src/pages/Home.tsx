import { useNavigate, Link } from 'react-router-dom'
import { SkipLink } from '../components/SkipLink'
import { LanguageStrip } from '../components/LanguageStrip'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Ticker } from '../components/Ticker'
import { Icon } from '../lib/icons'
import { useLanguage } from '../lib/translations'
import { ReadAloud } from '../components/ReadAloud'

export default function Home() {
  const navigate = useNavigate()
  const { t } = useLanguage()

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
              <p className="eyebrow">{t('home.eyebrow.forIL')}</p>
              <h1 id="hero-title" className="serif hero-title">{t('home.hero.title')}</h1>
              <p className="hero-sub">{t('home.hero.sub')}</p>
              <div className="hero-buttons">
                <button className="btn btn-midnight" onClick={() => navigate('/chat')}>{t('home.hero.start')}</button>
                <button className="btn btn-outline" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  {t('home.hero.how')}
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
              <div className="sticker sticker-1">{t('home.sticker.free')}</div>
              <div className="sticker sticker-2">{t('home.sticker.cited')}</div>
              <div className="sticker sticker-3">{t('home.sticker.langs')}</div>
            </div>
          </div>
        </section>

        <Ticker />

        <section className="section section-bone" aria-labelledby="about-title" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('home.about.eyebrow')}</p>
            <h2 id="about-title" className="serif section-title">{t('home.about.title')}</h2>
            <ReadAloud id="home-about" />
            <p className="section-sub">{t('home.about.sub')}</p>

            <div className="about-grid">
              <div className="about-text">
                <p><strong>{t('home.about.p1.lead')}</strong> {t('home.about.p1.body')}</p>
                <p><strong>{t('home.about.p2.lead')}</strong> {t('home.about.p2.body')}</p>
                <p><strong>{t('home.about.p3.lead')}</strong> {t('home.about.p3.body')}</p>
                <p><strong>{t('home.about.p4.lead')}</strong> {t('home.about.p4.body')}</p>
              </div>
              <div>
                <div className="fact-card">
                  <p className="fact-label">{t('home.fact.sources.label')}</p>
                  <p className="fact-value">{t('home.fact.sources.value')}</p>
                </div>
                <div className="fact-card">
                  <p className="fact-label">{t('home.fact.languages.label')}</p>
                  <p className="fact-value">{t('home.fact.languages.value')}</p>
                </div>
                <div className="fact-card">
                  <p className="fact-label">{t('home.fact.categories.label')}</p>
                  <p className="fact-value">{t('home.fact.categories.value')}</p>
                </div>
                <div className="fact-card">
                  <p className="fact-label">{t('home.fact.cost.label')}</p>
                  <p className="fact-value">{t('home.fact.cost.value')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-cream" id="how-it-works" aria-labelledby="how-title" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('home.how.eyebrow')}</p>
            <h2 id="how-title" className="serif section-title">{t('home.how.title')}</h2>
            <ReadAloud id="home-how" />
            <p className="section-sub">{t('home.how.sub')}</p>

            <ol className="steps-grid" style={{ listStyle: 'none', padding: 0 }}>
              <li className="step-card">
                <span className="step-number" aria-hidden="true">1</span>
                <Icon name="chat" size={36} className="step-icon" />
                <h3 className="serif step-title">{t('home.how.s1.title')}</h3>
                <p className="step-desc">{t('home.how.s1.desc')}</p>
              </li>
              <li className="step-card">
                <span className="step-number" aria-hidden="true">2</span>
                <Icon name="book" size={36} className="step-icon" />
                <h3 className="serif step-title">{t('home.how.s2.title')}</h3>
                <p className="step-desc">{t('home.how.s2.desc')}</p>
              </li>
              <li className="step-card">
                <span className="step-number" aria-hidden="true">3</span>
                <Icon name="check" size={36} className="step-icon" />
                <h3 className="serif step-title">{t('home.how.s3.title')}</h3>
                <p className="step-desc">{t('home.how.s3.desc')}</p>
              </li>
              <li className="step-card">
                <span className="step-number" aria-hidden="true">4</span>
                <Icon name="phone-ringing" size={36} className="step-icon" />
                <h3 className="serif step-title">{t('home.how.s4.title')}</h3>
                <p className="step-desc">{t('home.how.s4.desc')}</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="section section-bone" aria-labelledby="walkthrough-title" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('home.walk.eyebrow')}</p>
            <h2 id="walkthrough-title" className="serif section-title">{t('home.walk.title')}</h2>
            <ReadAloud id="home-walk" />
            <p className="section-sub">{t('home.walk.sub')}</p>

            <ol className="step-list">
              <li><strong>{t('home.walk.s1.lead')}</strong>{t('home.walk.s1.body')}</li>
              <li><strong>{t('home.walk.s2.lead')}</strong>{t('home.walk.s2.body')}</li>
              <li><strong>{t('home.walk.s3.lead')}</strong>{t('home.walk.s3.body')}</li>
              <li><strong>{t('home.walk.s4.lead')}</strong>{t('home.walk.s4.body')}</li>
              <li><strong>{t('home.walk.s5.lead')}</strong>{t('home.walk.s5.body')}</li>
            </ol>
          </div>
        </section>

        <section className="section section-cream" aria-labelledby="topics-title" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('home.topics.eyebrow')}</p>
            <h2 id="topics-title" className="serif section-title">{t('home.topics.title')}</h2>
            <ReadAloud id="home-topics" />

            <div className="topic-grid">
              <Link to="/housing" className="topic-card" aria-label="Housing and rent topic, most asked">
                <span className="badge most-asked">{t('home.topics.mostAsked')}</span>
                <Icon name="home" size={28} className="topic-icon" />
                <h3 className="serif topic-title">{t('home.topic.housing.title')}</h3>
                <p className="topic-desc">{t('home.topic.housing.desc')}</p>
                <p className="topic-cta">{t('home.topics.readMore')}</p>
              </Link>
              <Link to="/money" className="topic-card">
                <Icon name="money" size={28} className="topic-icon" />
                <h3 className="serif topic-title">{t('home.topic.money.title')}</h3>
                <p className="topic-desc">{t('home.topic.money.desc')}</p>
                <p className="topic-cta">{t('home.topics.readMore')}</p>
              </Link>
              <Link to="/repairs" className="topic-card">
                <Icon name="wrench" size={28} className="topic-icon" />
                <h3 className="serif topic-title">{t('home.topic.repairs.title')}</h3>
                <p className="topic-desc">{t('home.topic.repairs.desc')}</p>
                <p className="topic-cta">{t('home.topics.readMore')}</p>
              </Link>
              <Link to="/benefits" className="topic-card" aria-label="Public benefits topic, new">
                <span className="badge new">{t('home.topics.new')}</span>
                <Icon name="benefits" size={28} className="topic-icon" />
                <h3 className="serif topic-title">{t('home.topic.benefits.title')}</h3>
                <p className="topic-desc">{t('home.topic.benefits.desc')}</p>
                <p className="topic-cta">{t('home.topics.readMore')}</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="section section-midnight" aria-labelledby="partners-title" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('home.partners.eyebrow')}</p>
            <h2 id="partners-title" className="serif" style={{ fontSize: '2.1rem', margin: '0 0 1.4rem' }}>{t('home.partners.title')}</h2>
            <ReadAloud id="home-partners" dark />
            <p style={{ fontSize: '1.08rem', lineHeight: 1.55, maxWidth: '45rem', opacity: 0.88 }}>
              {t('home.partners.body')}
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
