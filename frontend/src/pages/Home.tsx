import { useNavigate, Link } from 'react-router-dom'
import { SkipLink } from '../components/SkipLink'
import { LanguageStrip } from '../components/LanguageStrip'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Ticker } from '../components/Ticker'
import { FindHelpNearMe } from '../components/FindHelpNearMe'
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

        {/* 1, Hero */}
        <section className="hero" aria-labelledby="hero-title" data-readable>
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">{t('home.eyebrow.forIL')}</p>
              <div className="section-head">
                <h1 id="hero-title" className="serif hero-title">{t('home.hero.title')}</h1>
                <ReadAloud id="home-hero" />
              </div>
              <p className="hero-sub">{t('home.hero.sub')}</p>
              <div className="hero-buttons">
                <button className="btn btn-burgundy" onClick={() => navigate('/chat')}>{t('nav.askQuestion')}</button>
                <button className="btn btn-outline" onClick={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })}>
                  {t('home.hero.browse')}
                </button>
              </div>
            </div>
            <div className="hero-media" aria-hidden="true">
              <span className="hero-media-mark" role="img" aria-label="Rights Within Reach" />
            </div>
          </div>
        </section>

        <Ticker />

        {/* 2, Choose what you need (topic directory) */}
        <section className="section section-cream" id="topics" aria-labelledby="topics-title" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('home.topics.eyebrow')}</p>
            <div className="section-head">
              <h2 id="topics-title" className="serif section-title">{t('home.topics.title')}</h2>
              <ReadAloud id="home-topics" />
            </div>

            <div className="topic-grid">
              <Link to="/housing" className="topic-card" style={{ ['--topic-accent' as string]: 'var(--burgundy)' }} aria-label={t('home.topic.housing.aria')}>
                <span className="badge most-asked">{t('home.topics.mostAsked')}</span>
                <span className="topic-chip"><Icon name="home" size={26} /></span>
                <h3 className="serif topic-title">{t('home.topic.housing.title')}</h3>
                <p className="topic-desc">{t('home.topic.housing.desc')}</p>
                <p className="topic-cta">{t('home.topics.readMore')}</p>
              </Link>
              <Link to="/money" className="topic-card" style={{ ['--topic-accent' as string]: 'var(--clover)' }}>
                <span className="topic-chip"><Icon name="money" size={26} /></span>
                <h3 className="serif topic-title">{t('home.topic.money.title')}</h3>
                <p className="topic-desc">{t('home.topic.money.desc')}</p>
                <p className="topic-cta">{t('home.topics.readMore')}</p>
              </Link>
              <Link to="/repairs" className="topic-card" style={{ ['--topic-accent' as string]: 'var(--repairs)' }}>
                <span className="topic-chip"><Icon name="wrench" size={26} /></span>
                <h3 className="serif topic-title">{t('home.topic.repairs.title')}</h3>
                <p className="topic-desc">{t('home.topic.repairs.desc')}</p>
                <p className="topic-cta">{t('home.topics.readMore')}</p>
              </Link>
              <Link to="/benefits" className="topic-card" style={{ ['--topic-accent' as string]: '#B8451F' }} aria-label={t('home.topic.benefits.aria')}>
                <span className="badge new">{t('home.topics.new')}</span>
                <span className="topic-chip"><Icon name="benefits" size={26} /></span>
                <h3 className="serif topic-title">{t('home.topic.benefits.title')}</h3>
                <p className="topic-desc">{t('home.topic.benefits.desc')}</p>
                <p className="topic-cta">{t('home.topics.readMore')}</p>
              </Link>
            </div>
          </div>
        </section>

        {/* 3, How it works */}
        <section className="section section-bone" id="how-it-works" aria-labelledby="how-title" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('home.how.eyebrow')}</p>
            <div className="section-head">
              <h2 id="how-title" className="serif section-title">{t('home.how.title')}</h2>
              <ReadAloud id="home-how" />
            </div>
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

        {/* 4, Why you can trust this */}
        <section className="section section-midnight" aria-labelledby="trust-title" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('home.trust.eyebrow')}</p>
            <div className="section-head">
              <h2 id="trust-title" className="serif section-title">{t('home.trust.title')}</h2>
              <ReadAloud id="home-trust" dark />
            </div>

            <div className="trust-grid">
              <div className="trust-item"><Icon name="book" size={30} className="trust-icon" /><p>{t('home.trust.law')}</p></div>
              <div className="trust-item"><Icon name="language" size={30} className="trust-icon" /><p>{t('home.trust.lang')}</p></div>
              <div className="trust-item"><Icon name="check" size={30} className="trust-icon" /><p>{t('home.trust.free')}</p></div>
              <div className="trust-item"><Icon name="calendar" size={30} className="trust-icon" /><p>{t('home.trust.fresh')}</p></div>
            </div>
          </div>
        </section>

        {/* 5, Find help near you */}
        <FindHelpNearMe />

        {/* 6, Real organizations */}
        <section className="section section-cream real-help" aria-labelledby="orgs-title" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('home.orgs.eyebrow')}</p>
            <div className="section-head">
              <h2 id="orgs-title" className="serif section-title">{t('home.orgs.title')}</h2>
              <ReadAloud id="home-orgs" />
            </div>
            <p className="section-sub">{t('home.orgs.sub')}</p>

            <ul className="org-pills">
              <li>211 Metro Chicago</li>
              <li>Illinois Legal Aid Online</li>
              <li>Eviction Help Illinois</li>
              <li>Cook County Legal Aid for Housing &amp; Debt</li>
              <li>CARPLS Legal Aid Hotline</li>
              <li>Legal Aid Chicago</li>
            </ul>
            <Link to="/resources" className="btn btn-midnight" style={{ marginTop: '1.6rem' }}>{t('home.orgs.cta')}</Link>
          </div>
        </section>

        {/* 7, Reassurance close */}
        <section className="section section-close" aria-labelledby="close-title" data-readable>
          <div className="section-inner close-inner">
            <div className="section-head">
              <h2 id="close-title" className="serif section-title">{t('home.close.title')}</h2>
              <ReadAloud id="home-close" dark />
            </div>
            <p className="close-body">{t('home.close.body')}</p>
            <button className="btn btn-bone" onClick={() => navigate('/chat')}>{t('nav.askQuestion')}</button>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
