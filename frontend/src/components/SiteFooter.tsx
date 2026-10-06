import { Link } from 'react-router-dom'
import { useLanguage } from '../lib/translations'
import { SITE } from '../lib/siteInfo'

export function SiteFooter() {
  const { t } = useLanguage()
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-wordmark-img" role="img" aria-label="Rights Within Reach" />
          <p>{t('footer.tagline')}</p>
        </div>
        <div className="footer-col">
          <h2>{t('footer.topics')}</h2>
          <ul>
            <li><Link to="/housing">{t('footer.housingRent')}</Link></li>
            <li><Link to="/money">{t('footer.moneyDebt')}</Link></li>
            <li><Link to="/repairs">{t('footer.homeRepairs')}</Link></li>
            <li><Link to="/benefits">{t('footer.publicBenefits')}</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h2>{t('footer.help')}</h2>
          <ul>
            <li><Link to="/chat">{t('footer.askQuestion')}</Link></li>
            <li><Link to="/resources">{t('footer.findHelp')}</Link></li>
            <li><Link to="/deadline">{t('footer.deadline')}</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h2>{t('footer.legal')}</h2>
          <ul>
            <li><Link to="/about">{t('footer.aboutLink')}</Link></li>
            <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
            <li><Link to="/terms">{t('footer.terms')}</Link></li>
            <li><Link to="/cookies">{t('footer.cookies')}</Link></li>
            <li><Link to="/refunds">{t('footer.refunds')}</Link></li>
            <li><Link to="/accessibility">{t('footer.accessibility')}</Link></li>
          </ul>
        </div>
      </div>
      <p className="footer-disclaim">{t('footer.disclaimer')}</p>
      <p className="footer-operator">
        {t('footer.operatedBy')} {SITE.operator}, Chicago, Illinois.{' '}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <br />
        © {SITE.copyrightYear} {SITE.operator}
      </p>
    </footer>
  )
}
