import { Link } from 'react-router-dom'
import { useLanguage } from '../lib/translations'

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
          <h3>{t('footer.topics')}</h3>
          <ul>
            <li><Link to="/housing">{t('footer.housingRent')}</Link></li>
            <li><Link to="/money">{t('footer.moneyDebt')}</Link></li>
            <li><Link to="/repairs">{t('footer.homeRepairs')}</Link></li>
            <li><Link to="/benefits">{t('footer.publicBenefits')}</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>{t('footer.help')}</h3>
          <ul>
            <li><Link to="/chat">{t('footer.askQuestion')}</Link></li>
            <li><Link to="/resources">{t('footer.findHelp')}</Link></li>
            <li><Link to="/deadline">{t('footer.deadline')}</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>{t('footer.about')}</h3>
          <ul>
            <li><a href="mailto:hello@rightswithinreach.org">{t('footer.contact')}</a></li>
          </ul>
        </div>
      </div>
      <p className="footer-disclaim">{t('footer.disclaimer')}</p>
    </footer>
  )
}
