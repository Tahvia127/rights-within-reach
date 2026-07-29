import { Link } from 'react-router-dom'
import { SkipLink } from '../components/SkipLink'
import { LanguageStrip } from '../components/LanguageStrip'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Icon, IconName } from '../lib/icons'
import { ReadAloud } from '../components/ReadAloud'
import { FindHelpNearMe } from '../components/FindHelpNearMe'
import { useLanguage, Language } from '../lib/translations'

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
    name: '211 Metro Chicago (United Way)',
    desc: 'Free 24/7 helpline that connects you to a real person. Tell them your ZIP code and they route you to local help for rent, utilities, eviction prevention, food, and shelter.',
    tag: 'Start here',
    meta: ['Call or text 2-1-1', '24/7 · free'],
    href: 'tel:211',
    featured: true,
  },
  {
    name: 'Illinois Legal Aid Online, Get Legal Help',
    desc: 'Statewide triage platform. Answer a few questions and they will connect you with a legal aid lawyer near you who handles your type of case.',
    tag: 'Featured',
    meta: ['illinoislegalaid.org', 'Spanish available'],
    href: 'https://illinoislegalaid.org',
    featured: true,
  },
  {
    name: 'CARPLS Legal Aid Hotline',
    desc: 'Free legal hotline for Cook County residents. Speak with a lawyer about housing, debt, family, consumer, and many other issues.',
    tag: 'Featured',
    meta: ['312-738-9200', 'Mon to Fri (to 7:30 Mon/Wed)'],
    href: 'tel:3127389200',
    featured: true,
  },
  {
    name: 'Cook County Legal Aid for Housing & Debt (CCLAHD)',
    desc: 'Free help with eviction, foreclosure, and consumer debt for ALL Cook County residents, regardless of income, language, or immigration status. Runs the court Early Resolution Program.',
    tag: 'Start here',
    meta: ['855-956-5763', 'Mon to Fri, 9 to 4:30'],
    href: 'tel:8559565763',
    featured: true,
  },
]

const HOUSING: ResourceCard[] = [
  { name: 'Law Center for Better Housing (LCBH)', desc: 'Tenant defense, building code enforcement, and Section 8 voucher protection. Free representation for low-income Chicago renters.', tag: 'Chicago', meta: ['lcbh.org', '312-347-7600'] },
  { name: 'Legal Aid Chicago, Housing Practice', desc: 'Eviction defense, foreclosure prevention, and tenant rights education in Chicago and Cook County.', tag: 'Chicago', meta: ['312-341-1070', 'Mon to Fri'] },
  { name: 'Chicago 311', desc: 'Report habitability problems like no heat, no water, pests, or unsafe conditions. Inspector reports are useful evidence.', tag: 'City', meta: ['Call 311', '24/7'], href: 'tel:311' },
  { name: 'Metropolitan Tenants Organization (MTO)', desc: 'Free tenants’ rights hotline for Chicago renters. Bilingual counselors explain your rights and help with repairs, evictions, lockouts, and unsafe conditions. Voicemail accepted 24/7.', tag: 'Chicago', meta: ['773-292-4988', 'Mon to Fri, 1 to 5pm'], href: 'tel:7732924988' },
  { name: 'Illinois Court Help', desc: 'Free statewide guide to the court process, eviction steps, fee waivers, and e-filing. They explain what to do (not legal advice) and connect you to local help. Call or text.', tag: 'Court', meta: ['833-411-1121', 'Mon to Fri, 9 to 2'], href: 'tel:8334111121' },
  { name: 'Illinois Homeless Prevention (IDHS)', desc: 'Short-term rent, mortgage, or utility help to stop an eviction or foreclosure before it happens, for households not yet in eviction court. Call to find a local provider agency.', tag: 'Prevention', meta: ['1-833-234-6343', 'Find a provider'], href: 'tel:18332346343' },
  { name: 'HOPE Fair Housing Center', desc: 'Free help if you think you faced housing discrimination, based on race, disability, family status, or source of income like a voucher. They investigate and can take cases.', tag: 'Statewide', meta: ['630-690-6500', 'Discrimination'], href: 'tel:6306906500' },
  { name: 'Eviction Help Illinois', desc: 'Free legal help for renters facing eviction anywhere in Illinois. Text the word “eviction” to 85622 to start. A separate line serves non-citizens. Spanish available.', tag: 'Statewide', meta: ['Text “eviction” to 85622', 'Non-citizens: 855-631-0811'], href: 'tel:8556310811' },
]

const MONEY: ResourceCard[] = [
  { name: 'CFPB Consumer Complaint', desc: 'File a complaint against a debt collector, bank, or other financial company. The CFPB will require them to respond.', tag: 'Federal', meta: ['consumerfinance.gov', '855-411-2372'] },
  { name: 'Illinois Attorney General, Consumer', desc: 'File a consumer complaint about predatory lending, fraud, or unfair business practices in Illinois.', tag: 'Statewide', meta: ['illinoisattorneygeneral.gov', '800-386-5438'] },
  { name: 'LIHEAP, Energy Assistance', desc: 'Pay heating bills and prevent shutoffs. Apply through your local Community Action Agency. Limited funds open each fall.', tag: 'Program', meta: ['helpillinoisfamilies.com', '877-411-9276'] },
  { name: 'Consumer Credit Counseling Services', desc: 'Free or low-cost nonprofit credit counseling, debt management plans, and bankruptcy counseling.', tag: 'Nonprofit', meta: ['Find local agency', 'Free first session'] },
  { name: 'Citizens Utility Board (CUB)', desc: 'Free nonprofit watchdog for Illinois utility customers. They review your electric, gas, and phone bills for savings and explain your shut-off protections. Advice only, no bill payments.', tag: 'Utility', meta: ['1-800-669-5556', 'Mon to Fri, 9 to 4'], href: 'tel:18006695556' },
  { name: 'Catholic Charities (Chicago)', desc: 'Emergency rent and utility help, shelter, and crisis assistance for people of any faith across Cook and Lake Counties. Call to ask what is available near you.', tag: 'Emergency', meta: ['312-655-7700', 'Crisis help'], href: 'tel:3126557700' },
  { name: 'CEDA of Cook County', desc: 'Community Action Agency for suburban Cook County. Apply here for LIHEAP heating help, utility and water-bill assistance, and emergency furnace repair.', tag: 'Utility', meta: ['800-571-2332', 'Suburban Cook'], href: 'tel:8005712332' },
]

const REPAIRS: ResourceCard[] = [
  { name: 'Illinois Housing Development Authority', desc: 'Administers HAFHR and HRAP home repair grants for low-income homeowners across Illinois. Multiple programs available.', tag: 'Statewide', meta: ['ihda.org', '312-836-5200'] },
  { name: 'City of Chicago, Department of Housing', desc: 'Runs Chicago home-repair programs (EHRP, Roof & Porch). The Home Repair Program is not taking new registrations in 2026, call to ask what is open now, or see IHDA and Rebuilding Together.', tag: 'Chicago', meta: ['chicago.gov/doh', '312-744-3653'] },
  { name: 'Rebuilding Together Metro Chicago', desc: 'Volunteer-based home repair for low-income homeowners, seniors, veterans, and people with disabilities. No cost to qualifying homeowners.', tag: 'Nonprofit', meta: ['rebuildingtogether-chi.com', '312-201-1188'] },
  { name: 'Chicago HomeMod (MOPD)', desc: 'Up to $10,000 in accessibility modifications for Chicago residents with disabilities. Ramps, grab bars, accessible bathrooms.', tag: 'Chicago', meta: ['chicago.gov/mopd', '312-744-7050'] },
]

const BENEFITS: ResourceCard[] = [
  { name: 'ABE, Application for Benefits Eligibility', desc: 'The state portal to apply for SNAP, Medicaid, All Kids, TANF, and other benefits in a single application.', tag: 'State', meta: ['ABE.illinois.gov', 'Apply online'] },
  { name: 'Legal Aid Chicago, Benefits Practice', desc: 'Help with benefits appeals, overpayment cases, and reinstatement. Representation at administrative hearings.', tag: 'Chicago', meta: ['312-341-1070', 'Mon to Fri'] },
  { name: 'Greater Chicago Food Depository', desc: 'SNAP outreach, food pantries, and benefits application assistance. Free help completing your SNAP application.', tag: 'Nonprofit', meta: ['chicagosfoodbank.org', '773-247-3663'] },
  { name: 'Illinois DHS Family Community Resource Center', desc: 'In-person assistance with benefits applications, renewals, and case questions. Located in every Illinois county.', tag: 'State', meta: ['dhs.state.il.us', '800-843-6154'] },
  { name: 'Center for Disability & Elder Law (CDEL)', desc: 'Free legal help for low-income older adults and people with disabilities in Cook County, housing stability, financial matters, guardianship, and benefits.', tag: 'Seniors', meta: ['312-376-1880', 'Mon to Fri, 9 to 12'], href: 'tel:3123761880' },
  { name: 'Access Living', desc: 'Disability-led center for independent living in Chicago. Civil-rights advocacy, accessible-housing help, benefits guidance, and HUD-certified housing counseling for people with disabilities.', tag: 'Disability', meta: ['312-640-2100', 'accessliving.org'], href: 'tel:3126402100' },
]

const COURT: ResourceCard[] = [
  { name: 'Illinois Free Legal Answers', desc: 'Post a civil legal question online and get a free answer from a volunteer Illinois attorney. For income-eligible people who do not have a lawyer.', tag: 'Self-help', meta: ['il.freelegalanswers.org', 'Free · online'], href: 'https://il.freelegalanswers.org' },
  { name: 'CARPLS Court Self-Help Centers', desc: 'Free document preparation and legal advice (not courtroom representation) at four Cook County courthouse locations. Good if you are going to court without a lawyer.', tag: 'Court', meta: ['carpls.org', 'Cook County courts'] },
  { name: 'Chicago Volunteer Legal Services (CVLS)', desc: 'Pro bono volunteer attorneys for low-income Chicagoans, housing, consumer, family, probate, and immigration intake.', tag: 'Pro bono', meta: ['312-332-1624', 'cvls.org'], href: 'tel:3123321624' },
  { name: 'Cook County Circuit Court Self-Help', desc: 'Official court forms for small claims, eviction defense, name changes, and more, with instructions for people representing themselves.', tag: 'Forms', meta: ['cookcountyclerkofcourt.org', 'Court forms'] },
]

const SAFETY: ResourceCard[] = [
  { name: 'Illinois Domestic Violence Hotline', desc: 'Free, confidential 24/7 statewide help for survivors. Safety planning, shelter, and connections to local advocates and lawyers.', tag: '24/7', meta: ['1-877-863-6338', '24/7 · free'], href: 'tel:18778636338' },
  { name: 'The Network: Advocating Against Domestic Violence', desc: 'Coalition of 40+ Chicago-area domestic-violence groups. Guidance on the Safe Homes Act (break a lease, change locks) and advocate-to-attorney referrals.', tag: 'Statewide', meta: ['the-network.org', 'Safe Homes Act'] },
  { name: 'Mujeres Latinas en Acción', desc: 'Bilingual domestic-violence and sexual-assault services for Latinas, plus parenting support.', tag: 'Bilingual', meta: ['mujereslatinasenaccion.org', 'Español'] },
  { name: 'Apna Ghar', desc: 'Multilingual crisis line, transitional housing, and legal advocacy for South Asian, Middle Eastern, and African survivors.', tag: 'Multilingual', meta: ['apnaghar.org', 'Chicago'] },
]

const VETERANS: ResourceCard[] = [
  { name: 'Veterans Assistance Commission of Cook County', desc: 'Emergency help with rent, mortgage, utilities, food, and transportation for Cook County veterans, plus free officers who file VA claims and appeals.', tag: 'Cook County', meta: ['312-433-6010', 'Mon to Fri 8:30 to 3'], href: 'tel:3124336010' },
  { name: "Illinois Dept. of Veterans' Affairs (IDVA)", desc: 'Statewide veteran services, benefits-claim help, DD-214 records, and long-term care homes. Cook County office plus offices statewide.', tag: 'Statewide', meta: ['312-814-2460', 'veterans.illinois.gov'], href: 'tel:3128142460' },
  { name: 'Illinois Warrior Assistance Program', desc: 'Free 24-hour support line for PTSD and traumatic brain injury for Illinois service members and veterans.', tag: '24/7', meta: ['1-866-554-4927', 'PTSD / TBI'], href: 'tel:18665544927' },
]

const LGBTQ: ResourceCard[] = [
  { name: 'Howard Brown Health', desc: 'Affirming healthcare plus help with housing, jobs, food, and benefits across several Chicago locations. Free weekly legal services through Legal Council for Health Justice.', tag: 'Chicago', meta: ['773-388-1600', 'howardbrown.org'], href: 'tel:7733881600' },
  { name: 'Center on Halsted', desc: 'LGBTQ+ community center with a legal clinic and referrals, senior housing, therapy, job training, and anti-violence programs.', tag: 'Chicago', meta: ['773-472-6469', '3656 N. Halsted'], href: 'tel:7734726469' },
  { name: 'Lambda Legal (Illinois)', desc: 'Free legal representation and impact litigation for LGBTQ+ people facing discrimination in housing, benefits, and more.', tag: 'Legal', meta: ['lambdalegal.org', 'Free legal help'] },
  { name: 'Brave Space Alliance', desc: 'Black- and trans-led mutual aid, food pantry, jobs, a trans relief fund, and transitional housing for LGBTQ+ people facing homelessness.', tag: 'Mutual aid', meta: ['Chicago', 'South Side'] },
]

// Card tag + description translations, keyed by the English text. Machine-drafted,
// PENDING NATIVE-SPEAKER REVIEW. A missing key falls back to English. Org names,
// phone numbers, and the meta line are left as-is across languages.
const TAG_I18N: Record<Language, Record<string, string>> = {
  en: {},
  es: { 'Start here': 'Empieza aquí', 'Featured': 'Destacado', 'Chicago': 'Chicago', 'City': 'Ciudad', 'Court': 'Corte', 'Prevention': 'Prevención', 'Statewide': 'Estatal', 'Federal': 'Federal', 'Program': 'Programa', 'Nonprofit': 'Sin fines de lucro', 'Utility': 'Servicios', 'Emergency': 'Emergencia', 'State': 'Estado', 'Seniors': 'Mayores', 'Disability': 'Discapacidad', 'Self-help': 'Autoayuda', 'Pro bono': 'Pro bono', 'Forms': 'Formularios', '24/7': '24/7', 'Bilingual': 'Bilingüe', 'Multilingual': 'Multilingüe', 'Cook County': 'Condado de Cook', 'Legal': 'Legal', 'Mutual aid': 'Ayuda mutua' },
  zh: { 'Start here': '从这里开始', 'Featured': '推荐', 'Chicago': '芝加哥', 'City': '市政', 'Court': '法庭', 'Prevention': '预防', 'Statewide': '全州', 'Federal': '联邦', 'Program': '项目', 'Nonprofit': '非营利', 'Utility': '公用事业', 'Emergency': '紧急', 'State': '州', 'Seniors': '老年人', 'Disability': '残障', 'Self-help': '自助', 'Pro bono': '公益', 'Forms': '表格', '24/7': '24/7', 'Bilingual': '双语', 'Multilingual': '多语言', 'Cook County': '库克县', 'Legal': '法律', 'Mutual aid': '互助' },
  tl: { 'Start here': 'Magsimula dito', 'Featured': 'Itinatampok', 'Chicago': 'Chicago', 'City': 'Lungsod', 'Court': 'Korte', 'Prevention': 'Pag-iwas', 'Statewide': 'Buong estado', 'Federal': 'Pederal', 'Program': 'Programa', 'Nonprofit': 'Nonprofit', 'Utility': 'Utility', 'Emergency': 'Emerhensiya', 'State': 'Estado', 'Seniors': 'Matatanda', 'Disability': 'Kapansanan', 'Self-help': 'Self-help', 'Pro bono': 'Pro bono', 'Forms': 'Mga form', '24/7': '24/7', 'Bilingual': 'Bilinggwal', 'Multilingual': 'Multilinggwal', 'Cook County': 'Cook County', 'Legal': 'Legal', 'Mutual aid': 'Tulungang mutwal' },
  vi: { 'Start here': 'Bắt đầu ở đây', 'Featured': 'Nổi bật', 'Chicago': 'Chicago', 'City': 'Thành phố', 'Court': 'Tòa án', 'Prevention': 'Phòng ngừa', 'Statewide': 'Toàn bang', 'Federal': 'Liên bang', 'Program': 'Chương trình', 'Nonprofit': 'Phi lợi nhuận', 'Utility': 'Tiện ích', 'Emergency': 'Khẩn cấp', 'State': 'Bang', 'Seniors': 'Người cao tuổi', 'Disability': 'Khuyết tật', 'Self-help': 'Tự trợ giúp', 'Pro bono': 'Miễn phí', 'Forms': 'Biểu mẫu', '24/7': '24/7', 'Bilingual': 'Song ngữ', 'Multilingual': 'Đa ngôn ngữ', 'Cook County': 'Quận Cook', 'Legal': 'Pháp lý', 'Mutual aid': 'Tương trợ' },
}

const DESC_I18N: Record<Language, Record<string, string>> = {
  en: {},
  es: {
    'Free 24/7 helpline that connects you to a real person. Tell them your ZIP code and they route you to local help for rent, utilities, eviction prevention, food, and shelter.': 'Línea gratuita 24/7 que te conecta con una persona real. Da tu código postal y te dirigen a ayuda local para renta, servicios, prevención de desalojo, comida y refugio.',
    'Statewide triage platform. Answer a few questions and they will connect you with a legal aid lawyer near you who handles your type of case.': 'Plataforma estatal de orientación. Responde unas preguntas y te conectan con un abogado de ayuda legal cerca de ti que maneja tu tipo de caso.',
    'Free legal hotline for Cook County residents. Speak with a lawyer about housing, debt, family, consumer, and many other issues.': 'Línea legal gratuita para residentes del Condado de Cook. Habla con un abogado sobre vivienda, deudas, familia, consumo y muchos otros temas.',
    'Free help with eviction, foreclosure, and consumer debt for ALL Cook County residents, regardless of income, language, or immigration status. Runs the court Early Resolution Program.': 'Ayuda gratuita con desalojo, ejecución hipotecaria y deudas del consumidor para TODOS los residentes del Condado de Cook, sin importar ingreso, idioma o estatus migratorio. Maneja el Programa de Resolución Temprana de la corte.',
    'Tenant defense, building code enforcement, and Section 8 voucher protection. Free representation for low-income Chicago renters.': 'Defensa de inquilinos, cumplimiento del código de edificación y protección del vale de la Sección 8. Representación gratuita para inquilinos de bajos ingresos en Chicago.',
    'Eviction defense, foreclosure prevention, and tenant rights education in Chicago and Cook County.': 'Defensa contra desalojos, prevención de ejecuciones hipotecarias y educación sobre derechos de inquilinos en Chicago y el Condado de Cook.',
    'Report habitability problems like no heat, no water, pests, or unsafe conditions. Inspector reports are useful evidence.': 'Reporta problemas de habitabilidad como falta de calefacción, agua, plagas o condiciones inseguras. Los informes del inspector son evidencia útil.',
    'Free tenants’ rights hotline for Chicago renters. Bilingual counselors explain your rights and help with repairs, evictions, lockouts, and unsafe conditions. Voicemail accepted 24/7.': 'Línea gratuita de derechos de inquilinos para Chicago. Consejeros bilingües explican tus derechos y ayudan con reparaciones, desalojos, cambios de cerradura y condiciones inseguras. Buzón de voz 24/7.',
    'Free statewide guide to the court process, eviction steps, fee waivers, and e-filing. They explain what to do (not legal advice) and connect you to local help. Call or text.': 'Guía estatal gratuita sobre el proceso judicial: pasos del desalojo, exenciones de tarifas y presentación electrónica. Explican qué hacer (no es asesoría legal) y te conectan con ayuda local. Llama o envía texto.',
    'Short-term rent, mortgage, or utility help to stop an eviction or foreclosure before it happens, for households not yet in eviction court. Call to find a local provider agency.': 'Ayuda a corto plazo con renta, hipoteca o servicios para frenar un desalojo o ejecución hipotecaria antes de que ocurra, para hogares que aún no están en la corte de desalojo. Llama para encontrar una agencia local.',
    'Free help if you think you faced housing discrimination, based on race, disability, family status, or source of income like a voucher. They investigate and can take cases.': 'Ayuda gratuita si crees que sufriste discriminación de vivienda por raza, discapacidad, situación familiar o fuente de ingresos como un vale. Investigan y pueden tomar casos.',
    'Free legal help for renters facing eviction anywhere in Illinois. Text the word “eviction” to 85622 to start. A separate line serves non-citizens. Spanish available.': 'Ayuda legal gratuita para inquilinos que enfrentan desalojo en cualquier parte de Illinois. Envía la palabra “eviction” al 85622 para empezar. Hay una línea separada para no ciudadanos. Disponible en español.',
    'File a complaint against a debt collector, bank, or other financial company. The CFPB will require them to respond.': 'Presenta una queja contra un cobrador, banco u otra empresa financiera. La CFPB les exigirá que respondan.',
    'File a consumer complaint about predatory lending, fraud, or unfair business practices in Illinois.': 'Presenta una queja del consumidor sobre préstamos abusivos, fraude o prácticas comerciales injustas en Illinois.',
    'Pay heating bills and prevent shutoffs. Apply through your local Community Action Agency. Limited funds open each fall.': 'Paga facturas de calefacción y evita cortes. Solicita a través de tu Agencia de Acción Comunitaria local. Fondos limitados que abren cada otoño.',
    'Free or low-cost nonprofit credit counseling, debt management plans, and bankruptcy counseling.': 'Asesoría de crédito sin fines de lucro gratuita o de bajo costo, planes de manejo de deudas y asesoría de bancarrota.',
    'Free nonprofit watchdog for Illinois utility customers. They review your electric, gas, and phone bills for savings and explain your shut-off protections. Advice only, no bill payments.': 'Organización sin fines de lucro que vigila a las empresas de servicios de Illinois. Revisan tus facturas de luz, gas y teléfono para ahorrar y explican tus protecciones contra cortes. Solo asesoría, no pagan facturas.',
    'Emergency rent and utility help, shelter, and crisis assistance for people of any faith across Cook and Lake Counties. Call to ask what is available near you.': 'Ayuda de emergencia con renta y servicios, refugio y asistencia en crisis para personas de cualquier fe en los Condados de Cook y Lake. Llama para preguntar qué hay disponible cerca de ti.',
    'Community Action Agency for suburban Cook County. Apply here for LIHEAP heating help, utility and water-bill assistance, and emergency furnace repair.': 'Agencia de Acción Comunitaria para el Condado de Cook suburbano. Solicita aquí ayuda de calefacción LIHEAP, asistencia con facturas de servicios y agua, y reparación de calefacción de emergencia.',
    'Administers HAFHR and HRAP home repair grants for low-income homeowners across Illinois. Multiple programs available.': 'Administra las ayudas de reparación del hogar HAFHR y HRAP para propietarios de bajos ingresos en todo Illinois. Varios programas disponibles.',
    'Runs Chicago home-repair programs (EHRP, Roof & Porch). The Home Repair Program is not taking new registrations in 2026, call to ask what is open now, or see IHDA and Rebuilding Together.': 'Administra programas de reparación del hogar de Chicago (EHRP, Techo y Porche). El Programa de Reparación del Hogar no acepta nuevos registros en 2026: llame para preguntar qué hay disponible ahora, o consulte IHDA y Rebuilding Together.',
    'Volunteer-based home repair for low-income homeowners, seniors, veterans, and people with disabilities. No cost to qualifying homeowners.': 'Reparación del hogar con voluntarios para propietarios de bajos ingresos, personas mayores, veteranos y personas con discapacidades. Sin costo para propietarios que califican.',
    'Up to $10,000 in accessibility modifications for Chicago residents with disabilities. Ramps, grab bars, accessible bathrooms.': 'Hasta $10,000 en modificaciones de accesibilidad para residentes de Chicago con discapacidades. Rampas, barras de apoyo, baños accesibles.',
    'The state portal to apply for SNAP, Medicaid, All Kids, TANF, and other benefits in a single application.': 'El portal estatal para solicitar SNAP, Medicaid, All Kids, TANF y otros beneficios en una sola solicitud.',
    'Help with benefits appeals, overpayment cases, and reinstatement. Representation at administrative hearings.': 'Ayuda con apelaciones de beneficios, casos de sobrepago y reinstalación. Representación en audiencias administrativas.',
    'SNAP outreach, food pantries, and benefits application assistance. Free help completing your SNAP application.': 'Difusión de SNAP, despensas de comida y asistencia con solicitudes de beneficios. Ayuda gratuita para completar tu solicitud de SNAP.',
    'In-person assistance with benefits applications, renewals, and case questions. Located in every Illinois county.': 'Asistencia en persona con solicitudes de beneficios, renovaciones y preguntas de caso. Ubicada en cada condado de Illinois.',
    'Free legal help for low-income older adults and people with disabilities in Cook County, housing stability, financial matters, guardianship, and benefits.': 'Ayuda legal gratuita para adultos mayores de bajos ingresos y personas con discapacidades en el Condado de Cook: estabilidad de vivienda, asuntos financieros, tutela y beneficios.',
    'Disability-led center for independent living in Chicago. Civil-rights advocacy, accessible-housing help, benefits guidance, and HUD-certified housing counseling for people with disabilities.': 'Centro de vida independiente dirigido por personas con discapacidad en Chicago. Defensa de derechos civiles, ayuda con vivienda accesible, orientación de beneficios y asesoría de vivienda certificada por HUD.',
    'Post a civil legal question online and get a free answer from a volunteer Illinois attorney. For income-eligible people who do not have a lawyer.': 'Publica una pregunta legal civil en línea y recibe una respuesta gratis de un abogado voluntario de Illinois. Para personas que califican por ingresos y no tienen abogado.',
    'Free document preparation and legal advice (not courtroom representation) at four Cook County courthouse locations. Good if you are going to court without a lawyer.': 'Preparación de documentos y asesoría legal gratuita (no representación en la corte) en cuatro sedes judiciales del Condado de Cook. Útil si vas a la corte sin abogado.',
    'Pro bono volunteer attorneys for low-income Chicagoans, housing, consumer, family, probate, and immigration intake.': 'Abogados voluntarios pro bono para personas de bajos ingresos en Chicago: vivienda, consumo, familia, sucesiones e inmigración.',
    'Official court forms for small claims, eviction defense, name changes, and more, with instructions for people representing themselves.': 'Formularios oficiales de la corte para reclamos menores, defensa de desalojo, cambios de nombre y más, con instrucciones para personas que se representan a sí mismas.',
    'Free, confidential 24/7 statewide help for survivors. Safety planning, shelter, and connections to local advocates and lawyers.': 'Ayuda estatal gratuita y confidencial 24/7 para sobrevivientes. Planes de seguridad, refugio y conexiones con defensores y abogados locales.',
    'Coalition of 40+ Chicago-area domestic-violence groups. Guidance on the Safe Homes Act (break a lease, change locks) and advocate-to-attorney referrals.': 'Coalición de más de 40 grupos contra la violencia doméstica del área de Chicago. Orientación sobre la Ley de Hogares Seguros (terminar un contrato, cambiar cerraduras) y referencias de defensor a abogado.',
    'Bilingual domestic-violence and sexual-assault services for Latinas, plus parenting support.': 'Servicios bilingües de violencia doméstica y agresión sexual para latinas, más apoyo en la crianza.',
    'Multilingual crisis line, transitional housing, and legal advocacy for South Asian, Middle Eastern, and African survivors.': 'Línea de crisis multilingüe, vivienda de transición y defensa legal para sobrevivientes del sur de Asia, Medio Oriente y África.',
    'Emergency help with rent, mortgage, utilities, food, and transportation for Cook County veterans, plus free officers who file VA claims and appeals.': 'Ayuda de emergencia con renta, hipoteca, servicios, comida y transporte para veteranos del Condado de Cook, más oficiales gratuitos que presentan reclamos y apelaciones ante la VA.',
    'Statewide veteran services, benefits-claim help, DD-214 records, and long-term care homes. Cook County office plus offices statewide.': 'Servicios estatales para veteranos, ayuda con reclamos de beneficios, registros DD-214 y hogares de cuidado a largo plazo. Oficina en el Condado de Cook y oficinas en todo el estado.',
    'Free 24-hour support line for PTSD and traumatic brain injury for Illinois service members and veterans.': 'Línea de apoyo gratuita 24 horas para TEPT y lesiones cerebrales traumáticas para militares y veteranos de Illinois.',
    'Affirming healthcare plus help with housing, jobs, food, and benefits across several Chicago locations. Free weekly legal services through Legal Council for Health Justice.': 'Atención médica que te afirma, además de ayuda con vivienda, empleo, comida y beneficios en varias sedes de Chicago. Servicios legales gratuitos semanales a través de Legal Council for Health Justice.',
    'LGBTQ+ community center with a legal clinic and referrals, senior housing, therapy, job training, and anti-violence programs.': 'Centro comunitario LGBTQ+ con clínica legal y referencias, vivienda para personas mayores, terapia, capacitación laboral y programas contra la violencia.',
    'Free legal representation and impact litigation for LGBTQ+ people facing discrimination in housing, benefits, and more.': 'Representación legal gratuita y litigio de impacto para personas LGBTQ+ que enfrentan discriminación en vivienda, beneficios y más.',
    'Black- and trans-led mutual aid, food pantry, jobs, a trans relief fund, and transitional housing for LGBTQ+ people facing homelessness.': 'Ayuda mutua liderada por personas negras y trans: despensa de comida, empleo, un fondo de alivio trans y vivienda de transición para personas LGBTQ+ sin hogar.',
  },
  zh: {
    'Free 24/7 helpline that connects you to a real person. Tell them your ZIP code and they route you to local help for rent, utilities, eviction prevention, food, and shelter.': '免费的24/7热线，为您接通真人。告诉他们您的邮政编码，他们会为您转介到当地的租金、公用事业、防止驱逐、食物和住所帮助。',
    'Statewide triage platform. Answer a few questions and they will connect you with a legal aid lawyer near you who handles your type of case.': '全州分诊平台。回答几个问题，他们就会为您接通附近处理您这类案件的法律援助律师。',
    'Free legal hotline for Cook County residents. Speak with a lawyer about housing, debt, family, consumer, and many other issues.': '为库克县居民提供的免费法律热线。与律师讨论住房、债务、家庭、消费及许多其他问题。',
    'Free help with eviction, foreclosure, and consumer debt for ALL Cook County residents, regardless of income, language, or immigration status. Runs the court Early Resolution Program.': '为所有库克县居民提供关于驱逐、止赎和消费债务的免费帮助, 不论收入、语言或移民身份。运营法院的早期解决项目。',
    'Tenant defense, building code enforcement, and Section 8 voucher protection. Free representation for low-income Chicago renters.': '租户辩护、建筑法规执行和第8章房券保护。为芝加哥低收入租户提供免费代理。',
    'Eviction defense, foreclosure prevention, and tenant rights education in Chicago and Cook County.': '在芝加哥和库克县提供驱逐辩护、止赎预防和租户权利教育。',
    'Report habitability problems like no heat, no water, pests, or unsafe conditions. Inspector reports are useful evidence.': '举报无暖气、无水、虫害或不安全状况等居住问题。检查员报告是有用的证据。',
    'Free tenants’ rights hotline for Chicago renters. Bilingual counselors explain your rights and help with repairs, evictions, lockouts, and unsafe conditions. Voicemail accepted 24/7.': '为芝加哥租户提供的免费租户权利热线。双语顾问解释您的权利，并帮助处理维修、驱逐、锁门和不安全状况。24/7接收语音留言。',
    'Free statewide guide to the court process, eviction steps, fee waivers, and e-filing. They explain what to do (not legal advice) and connect you to local help. Call or text.': '关于法院流程的免费全州指南, 驱逐步骤、费用减免和电子提交。他们解释该做什么（非法律建议）并为您接通当地帮助。致电或短信。',
    'Short-term rent, mortgage, or utility help to stop an eviction or foreclosure before it happens, for households not yet in eviction court. Call to find a local provider agency.': '短期租金、房贷或公用事业帮助，在驱逐或止赎发生前加以阻止, 适用于尚未进入驱逐法庭的家庭。致电查找当地提供机构。',
    'Free help if you think you faced housing discrimination, based on race, disability, family status, or source of income like a voucher. They investigate and can take cases.': '如果您认为因种族、残障、家庭状况或像房券这样的收入来源而遭受住房歧视，可获得免费帮助。他们会调查并可受理案件。',
    'Free legal help for renters facing eviction anywhere in Illinois. Text the word “eviction” to 85622 to start. A separate line serves non-citizens. Spanish available.': '为伊利诺伊州任何地方面临驱逐的租户提供免费法律帮助。发送“eviction”至85622开始。另有一条专线服务非公民。提供西班牙语。',
    'File a complaint against a debt collector, bank, or other financial company. The CFPB will require them to respond.': '对催债人、银行或其他金融公司提出投诉。CFPB 将要求他们回应。',
    'File a consumer complaint about predatory lending, fraud, or unfair business practices in Illinois.': '就伊利诺伊州的掠夺性贷款、欺诈或不公平商业行为提出消费者投诉。',
    'Pay heating bills and prevent shutoffs. Apply through your local Community Action Agency. Limited funds open each fall.': '支付取暖费并防止断供。通过您当地的社区行动机构申请。资金有限，每年秋季开放。',
    'Free or low-cost nonprofit credit counseling, debt management plans, and bankruptcy counseling.': '免费或低成本的非营利信用咨询、债务管理计划和破产咨询。',
    'Free nonprofit watchdog for Illinois utility customers. They review your electric, gas, and phone bills for savings and explain your shut-off protections. Advice only, no bill payments.': '为伊利诺伊州公用事业客户服务的免费非营利监督组织。他们审查您的电费、燃气费和电话费以省钱，并解释您的断供保护。仅提供建议，不代付账单。',
    'Emergency rent and utility help, shelter, and crisis assistance for people of any faith across Cook and Lake Counties. Call to ask what is available near you.': '为库克县和莱克县任何信仰的人提供紧急租金和公用事业帮助、住所及危机援助。致电询问您附近有什么可用资源。',
    'Community Action Agency for suburban Cook County. Apply here for LIHEAP heating help, utility and water-bill assistance, and emergency furnace repair.': '库克县郊区的社区行动机构。在此申请 LIHEAP 取暖帮助、公用事业和水费援助，以及紧急炉子维修。',
    'Administers HAFHR and HRAP home repair grants for low-income homeowners across Illinois. Multiple programs available.': '为全伊利诺伊州的低收入房主管理 HAFHR 和 HRAP 房屋维修补助。提供多个项目。',
    'Runs Chicago home-repair programs (EHRP, Roof & Porch). The Home Repair Program is not taking new registrations in 2026, call to ask what is open now, or see IHDA and Rebuilding Together.': '管理芝加哥房屋维修项目（EHRP、屋顶与门廊）。房屋维修项目在 2026 年不接受新登记, 请致电询问目前有哪些项目开放，或查看 IHDA 和 Rebuilding Together。',
    'Volunteer-based home repair for low-income homeowners, seniors, veterans, and people with disabilities. No cost to qualifying homeowners.': '由志愿者为低收入房主、老年人、退伍军人和残障人士提供房屋维修。符合条件的房主无需付费。',
    'Up to $10,000 in accessibility modifications for Chicago residents with disabilities. Ramps, grab bars, accessible bathrooms.': '为芝加哥残障居民提供最高 $10,000 的无障碍改造。坡道、扶手、无障碍浴室。',
    'The state portal to apply for SNAP, Medicaid, All Kids, TANF, and other benefits in a single application.': '在一份申请中申请 SNAP、Medicaid、All Kids、TANF 及其他福利的州门户网站。',
    'Help with benefits appeals, overpayment cases, and reinstatement. Representation at administrative hearings.': '帮助处理福利上诉、超额支付案件和恢复。在行政听证会上代理。',
    'SNAP outreach, food pantries, and benefits application assistance. Free help completing your SNAP application.': 'SNAP 外展、食品发放点和福利申请协助。免费帮助完成您的 SNAP 申请。',
    'In-person assistance with benefits applications, renewals, and case questions. Located in every Illinois county.': '为福利申请、续期和个案问题提供面对面协助。位于伊利诺伊州每个县。',
    'Free legal help for low-income older adults and people with disabilities in Cook County, housing stability, financial matters, guardianship, and benefits.': '为库克县低收入老年人和残障人士提供免费法律帮助, 住房稳定、财务事务、监护和福利。',
    'Disability-led center for independent living in Chicago. Civil-rights advocacy, accessible-housing help, benefits guidance, and HUD-certified housing counseling for people with disabilities.': '芝加哥由残障人士主导的独立生活中心。为残障人士提供民权倡导、无障碍住房帮助、福利指导和 HUD 认证的住房咨询。',
    'Post a civil legal question online and get a free answer from a volunteer Illinois attorney. For income-eligible people who do not have a lawyer.': '在线发布民事法律问题，从伊利诺伊州志愿律师处获得免费回答。适用于符合收入条件且没有律师的人。',
    'Free document preparation and legal advice (not courtroom representation) at four Cook County courthouse locations. Good if you are going to court without a lawyer.': '在库克县四个法院地点提供免费文件准备和法律建议（非法庭代理）。如果您没有律师就要上法庭，这很有用。',
    'Pro bono volunteer attorneys for low-income Chicagoans, housing, consumer, family, probate, and immigration intake.': '为芝加哥低收入者提供公益志愿律师, 住房、消费、家庭、遗产认证和移民受理。',
    'Official court forms for small claims, eviction defense, name changes, and more, with instructions for people representing themselves.': '用于小额索赔、驱逐辩护、改名等的官方法院表格，附有为自我代理者准备的说明。',
    'Free, confidential 24/7 statewide help for survivors. Safety planning, shelter, and connections to local advocates and lawyers.': '为幸存者提供免费、保密的24/7全州帮助。安全计划、住所，以及与当地倡导者和律师的联系。',
    'Coalition of 40+ Chicago-area domestic-violence groups. Guidance on the Safe Homes Act (break a lease, change locks) and advocate-to-attorney referrals.': '由40多个芝加哥地区家庭暴力组织组成的联盟。提供关于《安全家园法》（解除租约、更换门锁）的指导以及从倡导者到律师的转介。',
    'Bilingual domestic-violence and sexual-assault services for Latinas, plus parenting support.': '为拉丁裔女性提供双语家庭暴力和性侵害服务，以及育儿支持。',
    'Multilingual crisis line, transitional housing, and legal advocacy for South Asian, Middle Eastern, and African survivors.': '为南亚、中东和非洲幸存者提供多语言危机热线、过渡住房和法律倡导。',
    'Emergency help with rent, mortgage, utilities, food, and transportation for Cook County veterans, plus free officers who file VA claims and appeals.': '为库克县退伍军人提供租金、房贷、公用事业、食物和交通的紧急帮助，以及免费的官员代为提交 VA 申请和上诉。',
    'Statewide veteran services, benefits-claim help, DD-214 records, and long-term care homes. Cook County office plus offices statewide.': '全州退伍军人服务、福利申请帮助、DD-214 记录和长期护理院。库克县办公室及全州各办公室。',
    'Free 24-hour support line for PTSD and traumatic brain injury for Illinois service members and veterans.': '为伊利诺伊州现役军人和退伍军人提供关于创伤后应激障碍和脑外伤的免费24小时支持热线。',
    'Affirming healthcare plus help with housing, jobs, food, and benefits across several Chicago locations. Free weekly legal services through Legal Council for Health Justice.': '在芝加哥多个地点提供肯定性医疗保健，以及住房、就业、食物和福利方面的帮助。通过 Legal Council for Health Justice 提供每周免费法律服务。',
    'LGBTQ+ community center with a legal clinic and referrals, senior housing, therapy, job training, and anti-violence programs.': 'LGBTQ+ 社区中心，设有法律诊所和转介、老年住房、治疗、职业培训和反暴力项目。',
    'Free legal representation and impact litigation for LGBTQ+ people facing discrimination in housing, benefits, and more.': '为在住房、福利等方面遭受歧视的 LGBTQ+ 人士提供免费法律代理和影响性诉讼。',
    'Black- and trans-led mutual aid, food pantry, jobs, a trans relief fund, and transitional housing for LGBTQ+ people facing homelessness.': '由黑人和跨性别者主导的互助, 食品发放点、就业、跨性别救助基金，以及为面临无家可归的 LGBTQ+ 人士提供的过渡住房。',
  },
  tl: {
    'Free 24/7 helpline that connects you to a real person. Tell them your ZIP code and they route you to local help for rent, utilities, eviction prevention, food, and shelter.': 'Libreng 24/7 helpline na nag-uugnay sa iyo sa tunay na tao. Sabihin ang iyong ZIP code at itinuturo ka nila sa lokal na tulong para sa upa, utility, pag-iwas sa pagpapaalis, pagkain, at silungan.',
    'Statewide triage platform. Answer a few questions and they will connect you with a legal aid lawyer near you who handles your type of case.': 'Platform ng triage sa buong estado. Sumagot ng ilang tanong at iuugnay ka nila sa abogado ng tulong legal malapit sa iyo na humahawak ng iyong uri ng kaso.',
    'Free legal hotline for Cook County residents. Speak with a lawyer about housing, debt, family, consumer, and many other issues.': 'Libreng legal na hotline para sa mga residente ng Cook County. Makipag-usap sa abogado tungkol sa pabahay, utang, pamilya, consumer, at marami pang isyu.',
    'Free help with eviction, foreclosure, and consumer debt for ALL Cook County residents, regardless of income, language, or immigration status. Runs the court Early Resolution Program.': 'Libreng tulong sa pagpapaalis, foreclosure, at utang ng consumer para sa LAHAT ng residente ng Cook County, anuman ang kita, wika, o katayuan sa imigrasyon. Pinapatakbo ang Early Resolution Program ng korte.',
    'Tenant defense, building code enforcement, and Section 8 voucher protection. Free representation for low-income Chicago renters.': 'Depensa ng umuupa, pagpapatupad ng building code, at proteksyon ng Section 8 voucher. Libreng representasyon para sa mababang kita na umuupa sa Chicago.',
    'Eviction defense, foreclosure prevention, and tenant rights education in Chicago and Cook County.': 'Depensa sa pagpapaalis, pag-iwas sa foreclosure, at edukasyon sa karapatan ng umuupa sa Chicago at Cook County.',
    'Report habitability problems like no heat, no water, pests, or unsafe conditions. Inspector reports are useful evidence.': 'Iulat ang mga problema sa pagkamatirahan tulad ng walang init, walang tubig, peste, o hindi ligtas na kondisyon. Ang ulat ng inspektor ay kapaki-pakinabang na ebidensya.',
    'Free tenants’ rights hotline for Chicago renters. Bilingual counselors explain your rights and help with repairs, evictions, lockouts, and unsafe conditions. Voicemail accepted 24/7.': 'Libreng hotline para sa karapatan ng umuupa sa Chicago. Ipinapaliwanag ng bilingguwal na tagapayo ang iyong mga karapatan at tumutulong sa pag-aayos, pagpapaalis, lockout, at hindi ligtas na kondisyon. Tumatanggap ng voicemail 24/7.',
    'Free statewide guide to the court process, eviction steps, fee waivers, and e-filing. They explain what to do (not legal advice) and connect you to local help. Call or text.': 'Libreng gabay sa buong estado sa proseso ng korte, mga hakbang sa pagpapaalis, fee waiver, at e-filing. Ipinapaliwanag nila kung ano ang gagawin (hindi legal na payo) at iuugnay ka sa lokal na tulong. Tumawag o mag-text.',
    'Short-term rent, mortgage, or utility help to stop an eviction or foreclosure before it happens, for households not yet in eviction court. Call to find a local provider agency.': 'Panandaliang tulong sa upa, mortgage, o utility para pigilan ang pagpapaalis o foreclosure bago ito mangyari, para sa mga sambahayang wala pa sa korte ng pagpapaalis. Tumawag para humanap ng lokal na provider agency.',
    'Free help if you think you faced housing discrimination, based on race, disability, family status, or source of income like a voucher. They investigate and can take cases.': 'Libreng tulong kung sa tingin mo ay nakaranas ka ng diskriminasyon sa pabahay, batay sa lahi, kapansanan, katayuan ng pamilya, o pinagkukunan ng kita tulad ng voucher. Iniimbestigahan nila at maaaring tumanggap ng kaso.',
    'Free legal help for renters facing eviction anywhere in Illinois. Text the word “eviction” to 85622 to start. A separate line serves non-citizens. Spanish available.': 'Libreng legal na tulong para sa mga umuupa na nahaharap sa pagpapaalis kahit saan sa Illinois. I-text ang salitang “eviction” sa 85622 para magsimula. May hiwalay na linya para sa mga hindi mamamayan. May Espanyol.',
    'File a complaint against a debt collector, bank, or other financial company. The CFPB will require them to respond.': 'Maghain ng reklamo laban sa isang maniningil ng utang, bangko, o ibang kompanyang pinansyal. Iaatas ng CFPB na sumagot sila.',
    'File a consumer complaint about predatory lending, fraud, or unfair business practices in Illinois.': 'Maghain ng reklamo ng consumer tungkol sa mapanlinlang na pagpapautang, pandaraya, o hindi patas na gawi sa negosyo sa Illinois.',
    'Pay heating bills and prevent shutoffs. Apply through your local Community Action Agency. Limited funds open each fall.': 'Magbayad ng bayarin sa pampainit at iwasan ang pagputol. Mag-apply sa pamamagitan ng iyong lokal na Community Action Agency. Limitadong pondo na bumubukas tuwing taglagas.',
    'Free or low-cost nonprofit credit counseling, debt management plans, and bankruptcy counseling.': 'Libre o murang nonprofit na credit counseling, mga plano sa pamamahala ng utang, at bankruptcy counseling.',
    'Free nonprofit watchdog for Illinois utility customers. They review your electric, gas, and phone bills for savings and explain your shut-off protections. Advice only, no bill payments.': 'Libreng nonprofit na bantay para sa mga customer ng utility sa Illinois. Sinusuri nila ang iyong bill sa kuryente, gas, at telepono para sa tipid at ipinapaliwanag ang iyong proteksyon sa pagputol. Payo lang, walang pagbabayad ng bill.',
    'Emergency rent and utility help, shelter, and crisis assistance for people of any faith across Cook and Lake Counties. Call to ask what is available near you.': 'Emergency na tulong sa upa at utility, silungan, at tulong sa krisis para sa mga tao ng anumang relihiyon sa Cook at Lake Counties. Tumawag para magtanong kung ano ang available malapit sa iyo.',
    'Community Action Agency for suburban Cook County. Apply here for LIHEAP heating help, utility and water-bill assistance, and emergency furnace repair.': 'Community Action Agency para sa suburban na Cook County. Mag-apply dito para sa tulong sa pampainit ng LIHEAP, tulong sa utility at bill ng tubig, at emergency na pag-aayos ng furnace.',
    'Administers HAFHR and HRAP home repair grants for low-income homeowners across Illinois. Multiple programs available.': 'Namamahala ng mga gawad sa pag-aayos ng bahay na HAFHR at HRAP para sa mababang kita na may-ari sa buong Illinois. Maraming programa ang available.',
    'Runs Chicago home-repair programs (EHRP, Roof & Porch). The Home Repair Program is not taking new registrations in 2026, call to ask what is open now, or see IHDA and Rebuilding Together.': 'Nagpapatakbo ng mga programa sa pag-aayos ng bahay sa Chicago (EHRP, Roof & Porch). Hindi tumatanggap ng bagong rehistro ang Home Repair Program sa 2026, tumawag para itanong kung ano ang bukas ngayon, o tingnan ang IHDA at Rebuilding Together.',
    'Volunteer-based home repair for low-income homeowners, seniors, veterans, and people with disabilities. No cost to qualifying homeowners.': 'Pag-aayos ng bahay na nakabatay sa boluntaryo para sa mababang kita na may-ari, matatanda, beterano, at may kapansanan. Walang gastos para sa mga kwalipikadong may-ari.',
    'Up to $10,000 in accessibility modifications for Chicago residents with disabilities. Ramps, grab bars, accessible bathrooms.': 'Hanggang $10,000 sa mga pagbabago para sa accessibility para sa mga residente ng Chicago na may kapansanan. Ramp, grab bar, accessible na banyo.',
    'The state portal to apply for SNAP, Medicaid, All Kids, TANF, and other benefits in a single application.': 'Ang state portal para mag-apply sa SNAP, Medicaid, All Kids, TANF, at iba pang benepisyo sa isang aplikasyon.',
    'Help with benefits appeals, overpayment cases, and reinstatement. Representation at administrative hearings.': 'Tulong sa apela ng benepisyo, kaso ng overpayment, at pagbabalik. Representasyon sa mga administratibong pagdinig.',
    'SNAP outreach, food pantries, and benefits application assistance. Free help completing your SNAP application.': 'SNAP outreach, mga food pantry, at tulong sa aplikasyon ng benepisyo. Libreng tulong sa pagkumpleto ng iyong aplikasyon sa SNAP.',
    'In-person assistance with benefits applications, renewals, and case questions. Located in every Illinois county.': 'Personal na tulong sa mga aplikasyon ng benepisyo, pag-renew, at tanong sa kaso. Matatagpuan sa bawat county ng Illinois.',
    'Free legal help for low-income older adults and people with disabilities in Cook County, housing stability, financial matters, guardianship, and benefits.': 'Libreng legal na tulong para sa mababang kita na matatanda at may kapansanan sa Cook County, katatagan sa pabahay, usaping pinansyal, guardianship, at benepisyo.',
    'Disability-led center for independent living in Chicago. Civil-rights advocacy, accessible-housing help, benefits guidance, and HUD-certified housing counseling for people with disabilities.': 'Sentro para sa independiyenteng pamumuhay na pinamumunuan ng may kapansanan sa Chicago. Adbokasiya sa karapatang sibil, tulong sa accessible na pabahay, gabay sa benepisyo, at HUD-certified na housing counseling para sa may kapansanan.',
    'Post a civil legal question online and get a free answer from a volunteer Illinois attorney. For income-eligible people who do not have a lawyer.': 'Mag-post ng sibil na legal na tanong online at makakuha ng libreng sagot mula sa boluntaryong abogado ng Illinois. Para sa mga taong kwalipikado ayon sa kita na walang abogado.',
    'Free document preparation and legal advice (not courtroom representation) at four Cook County courthouse locations. Good if you are going to court without a lawyer.': 'Libreng paghahanda ng dokumento at legal na payo (hindi representasyon sa korte) sa apat na lokasyon ng korte sa Cook County. Mabuti kung pupunta ka sa korte nang walang abogado.',
    'Pro bono volunteer attorneys for low-income Chicagoans, housing, consumer, family, probate, and immigration intake.': 'Mga pro bono na boluntaryong abogado para sa mababang kita na taga-Chicago, pabahay, consumer, pamilya, probate, at imigrasyon.',
    'Official court forms for small claims, eviction defense, name changes, and more, with instructions for people representing themselves.': 'Mga opisyal na form ng korte para sa small claims, depensa sa pagpapaalis, pagpapalit ng pangalan, at iba pa, na may tagubilin para sa mga kumakatawan sa sarili.',
    'Free, confidential 24/7 statewide help for survivors. Safety planning, shelter, and connections to local advocates and lawyers.': 'Libre, kumpidensyal na 24/7 na tulong sa buong estado para sa mga survivor. Pagpaplano ng kaligtasan, silungan, at koneksyon sa lokal na advocate at abogado.',
    'Coalition of 40+ Chicago-area domestic-violence groups. Guidance on the Safe Homes Act (break a lease, change locks) and advocate-to-attorney referrals.': 'Koalisyon ng 40+ na grupo laban sa karahasan sa tahanan sa lugar ng Chicago. Gabay sa Safe Homes Act (pagtatapos ng lease, pagpapalit ng kandado) at referral mula advocate patungong abogado.',
    'Bilingual domestic-violence and sexual-assault services for Latinas, plus parenting support.': 'Bilingguwal na serbisyo sa karahasan sa tahanan at sekswal na pang-aabuso para sa mga Latina, kasama ang suporta sa pagiging magulang.',
    'Multilingual crisis line, transitional housing, and legal advocacy for South Asian, Middle Eastern, and African survivors.': 'Multilinggwal na crisis line, transitional housing, at legal na adbokasiya para sa mga survivor na South Asian, Middle Eastern, at Aprikano.',
    'Emergency help with rent, mortgage, utilities, food, and transportation for Cook County veterans, plus free officers who file VA claims and appeals.': 'Emergency na tulong sa upa, mortgage, utility, pagkain, at transportasyon para sa mga beterano ng Cook County, kasama ang libreng opisyal na naghahain ng VA claim at apela.',
    'Statewide veteran services, benefits-claim help, DD-214 records, and long-term care homes. Cook County office plus offices statewide.': 'Serbisyo para sa beterano sa buong estado, tulong sa claim ng benepisyo, DD-214 records, at long-term care homes. Opisina sa Cook County kasama ang mga opisina sa buong estado.',
    'Free 24-hour support line for PTSD and traumatic brain injury for Illinois service members and veterans.': 'Libreng 24-oras na support line para sa PTSD at traumatic brain injury para sa mga service member at beterano ng Illinois.',
    'Affirming healthcare plus help with housing, jobs, food, and benefits across several Chicago locations. Free weekly legal services through Legal Council for Health Justice.': 'Tumatanggap na pangangalaga sa kalusugan kasama ang tulong sa pabahay, trabaho, pagkain, at benepisyo sa iba’t ibang lokasyon sa Chicago. Libreng lingguhang legal na serbisyo sa pamamagitan ng Legal Council for Health Justice.',
    'LGBTQ+ community center with a legal clinic and referrals, senior housing, therapy, job training, and anti-violence programs.': 'Sentro ng komunidad ng LGBTQ+ na may legal clinic at referral, pabahay para sa matatanda, therapy, job training, at mga programa laban sa karahasan.',
    'Free legal representation and impact litigation for LGBTQ+ people facing discrimination in housing, benefits, and more.': 'Libreng legal na representasyon at impact litigation para sa mga LGBTQ+ na nahaharap sa diskriminasyon sa pabahay, benepisyo, at iba pa.',
    'Black- and trans-led mutual aid, food pantry, jobs, a trans relief fund, and transitional housing for LGBTQ+ people facing homelessness.': 'Tulungang mutwal na pinamumunuan ng mga Black at trans, food pantry, trabaho, isang trans relief fund, at transitional housing para sa mga LGBTQ+ na nahaharap sa kawalan ng tahanan.',
  },
  vi: {
    'Free 24/7 helpline that connects you to a real person. Tell them your ZIP code and they route you to local help for rent, utilities, eviction prevention, food, and shelter.': 'Đường dây trợ giúp miễn phí 24/7 kết nối bạn với một người thật. Cho họ biết mã ZIP của bạn và họ sẽ hướng bạn đến trợ giúp địa phương về tiền thuê, tiện ích, phòng ngừa trục xuất, thực phẩm, và chỗ ở.',
    'Statewide triage platform. Answer a few questions and they will connect you with a legal aid lawyer near you who handles your type of case.': 'Nền tảng phân loại toàn bang. Trả lời vài câu hỏi và họ sẽ kết nối bạn với một luật sư trợ giúp pháp lý gần bạn xử lý loại vụ việc của bạn.',
    'Free legal hotline for Cook County residents. Speak with a lawyer about housing, debt, family, consumer, and many other issues.': 'Đường dây pháp lý miễn phí cho cư dân Quận Cook. Nói chuyện với luật sư về nhà ở, nợ, gia đình, tiêu dùng, và nhiều vấn đề khác.',
    'Free help with eviction, foreclosure, and consumer debt for ALL Cook County residents, regardless of income, language, or immigration status. Runs the court Early Resolution Program.': 'Trợ giúp miễn phí về trục xuất, tịch thu nhà, và nợ tiêu dùng cho TẤT CẢ cư dân Quận Cook, bất kể thu nhập, ngôn ngữ, hay tình trạng nhập cư. Điều hành Chương trình Giải quyết Sớm của tòa.',
    'Tenant defense, building code enforcement, and Section 8 voucher protection. Free representation for low-income Chicago renters.': 'Bảo vệ người thuê, thực thi quy chuẩn xây dựng, và bảo vệ phiếu Section 8. Đại diện miễn phí cho người thuê thu nhập thấp ở Chicago.',
    'Eviction defense, foreclosure prevention, and tenant rights education in Chicago and Cook County.': 'Bảo vệ chống trục xuất, phòng ngừa tịch thu nhà, và giáo dục quyền người thuê ở Chicago và Quận Cook.',
    'Report habitability problems like no heat, no water, pests, or unsafe conditions. Inspector reports are useful evidence.': 'Báo cáo các vấn đề về điều kiện ở như không có sưởi, không có nước, sâu bọ, hoặc điều kiện không an toàn. Báo cáo của thanh tra là bằng chứng hữu ích.',
    'Free tenants’ rights hotline for Chicago renters. Bilingual counselors explain your rights and help with repairs, evictions, lockouts, and unsafe conditions. Voicemail accepted 24/7.': 'Đường dây quyền người thuê miễn phí cho người thuê Chicago. Cố vấn song ngữ giải thích quyền của bạn và giúp với sửa chữa, trục xuất, khóa cửa, và điều kiện không an toàn. Nhận tin nhắn thoại 24/7.',
    'Free statewide guide to the court process, eviction steps, fee waivers, and e-filing. They explain what to do (not legal advice) and connect you to local help. Call or text.': 'Hướng dẫn miễn phí toàn bang về quy trình tòa án, các bước trục xuất, miễn phí, và nộp đơn điện tử. Họ giải thích phải làm gì (không phải tư vấn pháp lý) và kết nối bạn với trợ giúp địa phương. Gọi hoặc nhắn tin.',
    'Short-term rent, mortgage, or utility help to stop an eviction or foreclosure before it happens, for households not yet in eviction court. Call to find a local provider agency.': 'Trợ giúp ngắn hạn về tiền thuê, thế chấp, hoặc tiện ích để ngăn trục xuất hoặc tịch thu nhà trước khi xảy ra, cho các hộ chưa ra tòa trục xuất. Gọi để tìm cơ quan cung cấp địa phương.',
    'Free help if you think you faced housing discrimination, based on race, disability, family status, or source of income like a voucher. They investigate and can take cases.': 'Trợ giúp miễn phí nếu bạn nghĩ mình bị phân biệt đối xử về nhà ở, dựa trên chủng tộc, khuyết tật, tình trạng gia đình, hoặc nguồn thu nhập như phiếu trợ cấp. Họ điều tra và có thể nhận vụ việc.',
    'Free legal help for renters facing eviction anywhere in Illinois. Text the word “eviction” to 85622 to start. A separate line serves non-citizens. Spanish available.': 'Trợ giúp pháp lý miễn phí cho người thuê đối mặt với trục xuất ở bất cứ đâu tại Illinois. Nhắn từ “eviction” đến 85622 để bắt đầu. Có một đường dây riêng phục vụ người không phải công dân. Có tiếng Tây Ban Nha.',
    'File a complaint against a debt collector, bank, or other financial company. The CFPB will require them to respond.': 'Nộp đơn khiếu nại đối với người đòi nợ, ngân hàng, hoặc công ty tài chính khác. CFPB sẽ yêu cầu họ phản hồi.',
    'File a consumer complaint about predatory lending, fraud, or unfair business practices in Illinois.': 'Nộp đơn khiếu nại người tiêu dùng về cho vay nặng lãi, gian lận, hoặc hành vi kinh doanh bất công ở Illinois.',
    'Pay heating bills and prevent shutoffs. Apply through your local Community Action Agency. Limited funds open each fall.': 'Trả hóa đơn sưởi và ngăn việc bị cắt. Đăng ký qua Cơ quan Hành động Cộng đồng địa phương của bạn. Quỹ có hạn, mở mỗi mùa thu.',
    'Free or low-cost nonprofit credit counseling, debt management plans, and bankruptcy counseling.': 'Tư vấn tín dụng phi lợi nhuận miễn phí hoặc chi phí thấp, kế hoạch quản lý nợ, và tư vấn phá sản.',
    'Free nonprofit watchdog for Illinois utility customers. They review your electric, gas, and phone bills for savings and explain your shut-off protections. Advice only, no bill payments.': 'Tổ chức phi lợi nhuận giám sát miễn phí cho khách hàng tiện ích Illinois. Họ xem xét hóa đơn điện, gas, và điện thoại của bạn để tiết kiệm và giải thích các bảo vệ chống cắt. Chỉ tư vấn, không trả hóa đơn.',
    'Emergency rent and utility help, shelter, and crisis assistance for people of any faith across Cook and Lake Counties. Call to ask what is available near you.': 'Trợ giúp khẩn cấp về tiền thuê và tiện ích, chỗ ở, và hỗ trợ khủng hoảng cho người thuộc mọi tín ngưỡng khắp Quận Cook và Lake. Gọi để hỏi có gì gần bạn.',
    'Community Action Agency for suburban Cook County. Apply here for LIHEAP heating help, utility and water-bill assistance, and emergency furnace repair.': 'Cơ quan Hành động Cộng đồng cho vùng ngoại ô Quận Cook. Đăng ký tại đây để được trợ giúp sưởi LIHEAP, hỗ trợ hóa đơn tiện ích và nước, và sửa lò sưởi khẩn cấp.',
    'Administers HAFHR and HRAP home repair grants for low-income homeowners across Illinois. Multiple programs available.': 'Quản lý các khoản trợ cấp sửa chữa nhà HAFHR và HRAP cho chủ nhà thu nhập thấp trên khắp Illinois. Có nhiều chương trình.',
    'Runs Chicago home-repair programs (EHRP, Roof & Porch). The Home Repair Program is not taking new registrations in 2026, call to ask what is open now, or see IHDA and Rebuilding Together.': 'Điều hành các chương trình sửa chữa nhà ở Chicago (EHRP, Roof & Porch). Chương trình Sửa chữa Nhà không nhận đăng ký mới trong năm 2026, hãy gọi để hỏi chương trình nào đang mở, hoặc xem IHDA và Rebuilding Together.',
    'Volunteer-based home repair for low-income homeowners, seniors, veterans, and people with disabilities. No cost to qualifying homeowners.': 'Sửa chữa nhà dựa trên tình nguyện viên cho chủ nhà thu nhập thấp, người cao tuổi, cựu chiến binh, và người khuyết tật. Miễn phí cho chủ nhà đủ điều kiện.',
    'Up to $10,000 in accessibility modifications for Chicago residents with disabilities. Ramps, grab bars, accessible bathrooms.': 'Lên đến $10,000 cho các sửa đổi tiếp cận cho cư dân Chicago khuyết tật. Đường dốc, thanh vịn, phòng tắm tiếp cận.',
    'The state portal to apply for SNAP, Medicaid, All Kids, TANF, and other benefits in a single application.': 'Cổng thông tin của bang để đăng ký SNAP, Medicaid, All Kids, TANF, và các phúc lợi khác trong một đơn duy nhất.',
    'Help with benefits appeals, overpayment cases, and reinstatement. Representation at administrative hearings.': 'Trợ giúp về kháng cáo phúc lợi, vụ việc trả thừa, và khôi phục. Đại diện tại các buổi điều trần hành chính.',
    'SNAP outreach, food pantries, and benefits application assistance. Free help completing your SNAP application.': 'Tiếp cận SNAP, ngân hàng thực phẩm, và hỗ trợ đơn phúc lợi. Trợ giúp miễn phí hoàn thành đơn SNAP của bạn.',
    'In-person assistance with benefits applications, renewals, and case questions. Located in every Illinois county.': 'Hỗ trợ trực tiếp về đơn phúc lợi, gia hạn, và câu hỏi hồ sơ. Có ở mọi quận của Illinois.',
    'Free legal help for low-income older adults and people with disabilities in Cook County, housing stability, financial matters, guardianship, and benefits.': 'Trợ giúp pháp lý miễn phí cho người cao tuổi thu nhập thấp và người khuyết tật ở Quận Cook, ổn định nhà ở, vấn đề tài chính, giám hộ, và phúc lợi.',
    'Disability-led center for independent living in Chicago. Civil-rights advocacy, accessible-housing help, benefits guidance, and HUD-certified housing counseling for people with disabilities.': 'Trung tâm sống độc lập do người khuyết tật dẫn dắt ở Chicago. Vận động quyền dân sự, trợ giúp nhà ở tiếp cận, hướng dẫn phúc lợi, và tư vấn nhà ở được HUD chứng nhận cho người khuyết tật.',
    'Post a civil legal question online and get a free answer from a volunteer Illinois attorney. For income-eligible people who do not have a lawyer.': 'Đăng câu hỏi pháp lý dân sự trực tuyến và nhận câu trả lời miễn phí từ luật sư tình nguyện Illinois. Cho người đủ điều kiện thu nhập không có luật sư.',
    'Free document preparation and legal advice (not courtroom representation) at four Cook County courthouse locations. Good if you are going to court without a lawyer.': 'Chuẩn bị giấy tờ và tư vấn pháp lý miễn phí (không đại diện tại tòa) tại bốn địa điểm tòa án Quận Cook. Tốt nếu bạn ra tòa mà không có luật sư.',
    'Pro bono volunteer attorneys for low-income Chicagoans, housing, consumer, family, probate, and immigration intake.': 'Luật sư tình nguyện miễn phí cho cư dân Chicago thu nhập thấp, nhà ở, tiêu dùng, gia đình, di chúc, và nhập cư.',
    'Official court forms for small claims, eviction defense, name changes, and more, with instructions for people representing themselves.': 'Biểu mẫu tòa án chính thức cho khiếu kiện nhỏ, bảo vệ chống trục xuất, đổi tên, và hơn thế, kèm hướng dẫn cho người tự đại diện.',
    'Free, confidential 24/7 statewide help for survivors. Safety planning, shelter, and connections to local advocates and lawyers.': 'Trợ giúp miễn phí, bảo mật, 24/7 toàn bang cho người sống sót. Lập kế hoạch an toàn, chỗ ở, và kết nối với người vận động và luật sư địa phương.',
    'Coalition of 40+ Chicago-area domestic-violence groups. Guidance on the Safe Homes Act (break a lease, change locks) and advocate-to-attorney referrals.': 'Liên minh hơn 40 nhóm chống bạo lực gia đình khu vực Chicago. Hướng dẫn về Đạo luật Nhà An toàn (chấm dứt hợp đồng thuê, đổi khóa) và giới thiệu từ người vận động đến luật sư.',
    'Bilingual domestic-violence and sexual-assault services for Latinas, plus parenting support.': 'Dịch vụ song ngữ về bạo lực gia đình và tấn công tình dục cho phụ nữ Latina, cùng hỗ trợ nuôi dạy con.',
    'Multilingual crisis line, transitional housing, and legal advocacy for South Asian, Middle Eastern, and African survivors.': 'Đường dây khủng hoảng đa ngôn ngữ, nhà ở chuyển tiếp, và vận động pháp lý cho người sống sót Nam Á, Trung Đông, và Châu Phi.',
    'Emergency help with rent, mortgage, utilities, food, and transportation for Cook County veterans, plus free officers who file VA claims and appeals.': 'Trợ giúp khẩn cấp về tiền thuê, thế chấp, tiện ích, thực phẩm, và đi lại cho cựu chiến binh Quận Cook, cùng các viên chức miễn phí nộp hồ sơ và kháng cáo VA.',
    'Statewide veteran services, benefits-claim help, DD-214 records, and long-term care homes. Cook County office plus offices statewide.': 'Dịch vụ cựu chiến binh toàn bang, trợ giúp hồ sơ phúc lợi, hồ sơ DD-214, và nhà chăm sóc dài hạn. Văn phòng Quận Cook cùng các văn phòng toàn bang.',
    'Free 24-hour support line for PTSD and traumatic brain injury for Illinois service members and veterans.': 'Đường dây hỗ trợ 24 giờ miễn phí về PTSD và chấn thương sọ não cho quân nhân và cựu chiến binh Illinois.',
    'Affirming healthcare plus help with housing, jobs, food, and benefits across several Chicago locations. Free weekly legal services through Legal Council for Health Justice.': 'Chăm sóc sức khỏe tôn trọng cùng trợ giúp về nhà ở, việc làm, thực phẩm, và phúc lợi tại nhiều địa điểm ở Chicago. Dịch vụ pháp lý miễn phí hằng tuần qua Legal Council for Health Justice.',
    'LGBTQ+ community center with a legal clinic and referrals, senior housing, therapy, job training, and anti-violence programs.': 'Trung tâm cộng đồng LGBTQ+ với phòng khám pháp lý và giới thiệu, nhà ở cho người cao tuổi, trị liệu, đào tạo nghề, và các chương trình chống bạo lực.',
    'Free legal representation and impact litigation for LGBTQ+ people facing discrimination in housing, benefits, and more.': 'Đại diện pháp lý miễn phí và kiện tụng tạo tác động cho người LGBTQ+ bị phân biệt đối xử về nhà ở, phúc lợi, và hơn thế.',
    'Black- and trans-led mutual aid, food pantry, jobs, a trans relief fund, and transitional housing for LGBTQ+ people facing homelessness.': 'Tương trợ do người Da đen và chuyển giới dẫn dắt, ngân hàng thực phẩm, việc làm, quỹ cứu trợ người chuyển giới, và nhà ở chuyển tiếp cho người LGBTQ+ vô gia cư.',
  },
}

// Card meta chips (the /badges). Keyed by the exact English string; phone
// numbers, URLs, addresses, and universal tokens (24/7, Chicago) fall back to
// English. Machine-drafted, pending native review.
const META_I18N: Record<Language, Record<string, string>> = {
  en: {},
  es: {
    'Call 311': 'Llame al 311',
    'Call or text 2-1-1': 'Llame o texto al 2-1-1',
    'Find local agency': 'Busque una agencia local',
    'Text “eviction” to 85622': 'Envíe “eviction” al 85622',
    '24/7 · free': '24/7 · gratis',
    'Apply online': 'Solicite en línea',
    'Cook County courts': 'Cortes del Condado de Cook',
    'Court forms': 'Formularios de la corte',
    'Crisis help': 'Ayuda en crisis',
    'Discrimination': 'Discriminación',
    'Find a provider': 'Busque un proveedor',
    'Free first session': 'Primera sesión gratis',
    'Free legal help': 'Ayuda legal gratuita',
    'Free · online': 'Gratis · en línea',
    'Mon to Fri': 'Lun to Vie',
    'Mon to Fri (to 7:30 Mon/Wed)': 'Lun to Vie (hasta 7:30 Lun/Mié)',
    'Mon to Fri 8:30 to 3': 'Lun to Vie 8:30 to 3',
    'Mon to Fri, 1 to 5pm': 'Lun to Vie, 1 to 5pm',
    'Mon to Fri, 9 to 12': 'Lun to Vie, 9 to 12',
    'Mon to Fri, 9 to 2': 'Lun to Vie, 9 to 2',
    'Mon to Fri, 9 to 4': 'Lun to Vie, 9 to 4',
    'Mon to Fri, 9 to 4:30': 'Lun to Vie, 9 to 4:30',
    'Non-citizens: 855-631-0811': 'No ciudadanos: 855-631-0811',
    'Spanish available': 'Español disponible',
    'Suburban Cook': 'Suburbios de Cook',
  },
  zh: {
    'Call 311': '拨打 311',
    'Call or text 2-1-1': '致电或短信 2-1-1',
    'Find local agency': '查找当地机构',
    'Text “eviction” to 85622': '发送 “eviction” 到 85622',
    '24/7 · free': '全天候 · 免费',
    'Apply online': '在线申请',
    'Cook County courts': '库克县法院',
    'Court forms': '法院表格',
    'Crisis help': '危机帮助',
    'Discrimination': '歧视',
    'Find a provider': '查找服务机构',
    'Free first session': '首次咨询免费',
    'Free legal help': '免费法律帮助',
    'Free · online': '免费 · 在线',
    'Mon to Fri': '周一至周五',
    'Mon to Fri (to 7:30 Mon/Wed)': '周一至周五（周一/三至 7:30）',
    'Mon to Fri 8:30 to 3': '周一至周五 8:30 to 3',
    'Mon to Fri, 1 to 5pm': '周一至周五 1 to 5pm',
    'Mon to Fri, 9 to 12': '周一至周五 9 to 12',
    'Mon to Fri, 9 to 2': '周一至周五 9 to 2',
    'Mon to Fri, 9 to 4': '周一至周五 9 to 4',
    'Mon to Fri, 9 to 4:30': '周一至周五 9 to 4:30',
    'Non-citizens: 855-631-0811': '非公民：855-631-0811',
    'Spanish available': '提供西班牙语',
    'Suburban Cook': '库克县郊区',
  },
  tl: {
    'Call 311': 'Tumawag sa 311',
    'Call or text 2-1-1': 'Tumawag o mag-text sa 2-1-1',
    'Find local agency': 'Maghanap ng lokal na ahensya',
    'Text “eviction” to 85622': 'I-text ang “eviction” sa 85622',
    '24/7 · free': '24/7 · libre',
    'Apply online': 'Mag-apply online',
    'Cook County courts': 'Mga korte ng Cook County',
    'Court forms': 'Mga form ng korte',
    'Crisis help': 'Tulong sa krisis',
    'Discrimination': 'Diskriminasyon',
    'Find a provider': 'Maghanap ng provider',
    'Free first session': 'Libreng unang sesyon',
    'Free legal help': 'Libreng tulong legal',
    'Free · online': 'Libre · online',
    'Mon to Fri': 'Lun to Biy',
    'Mon to Fri (to 7:30 Mon/Wed)': 'Lun to Biy (hanggang 7:30 Lun/Miy)',
    'Mon to Fri 8:30 to 3': 'Lun to Biy 8:30 to 3',
    'Mon to Fri, 1 to 5pm': 'Lun to Biy, 1 to 5pm',
    'Mon to Fri, 9 to 12': 'Lun to Biy, 9 to 12',
    'Mon to Fri, 9 to 2': 'Lun to Biy, 9 to 2',
    'Mon to Fri, 9 to 4': 'Lun to Biy, 9 to 4',
    'Mon to Fri, 9 to 4:30': 'Lun to Biy, 9 to 4:30',
    'Non-citizens: 855-631-0811': 'Mga di-mamamayan: 855-631-0811',
    'Spanish available': 'May Espanyol',
    'Suburban Cook': 'Suburban Cook',
  },
  vi: {
    'Call 311': 'Gọi 311',
    'Call or text 2-1-1': 'Gọi hoặc nhắn 2-1-1',
    'Find local agency': 'Tìm cơ quan địa phương',
    'Text “eviction” to 85622': 'Nhắn “eviction” đến 85622',
    '24/7 · free': '24/7 · miễn phí',
    'Apply online': 'Đăng ký trực tuyến',
    'Cook County courts': 'Tòa án Quận Cook',
    'Court forms': 'Mẫu đơn tòa án',
    'Crisis help': 'Trợ giúp khủng hoảng',
    'Discrimination': 'Phân biệt đối xử',
    'Find a provider': 'Tìm nhà cung cấp',
    'Free first session': 'Buổi đầu miễn phí',
    'Free legal help': 'Trợ giúp pháp lý miễn phí',
    'Free · online': 'Miễn phí · trực tuyến',
    'Mon to Fri': 'Thứ 2 to Thứ 6',
    'Mon to Fri (to 7:30 Mon/Wed)': 'Thứ 2 to Thứ 6 (đến 7:30 Thứ 2/4)',
    'Mon to Fri 8:30 to 3': 'Thứ 2 to Thứ 6 8:30 to 3',
    'Mon to Fri, 1 to 5pm': 'Thứ 2 to Thứ 6, 1 to 5pm',
    'Mon to Fri, 9 to 12': 'Thứ 2 to Thứ 6, 9 to 12',
    'Mon to Fri, 9 to 2': 'Thứ 2 to Thứ 6, 9 to 2',
    'Mon to Fri, 9 to 4': 'Thứ 2 to Thứ 6, 9 to 4',
    'Mon to Fri, 9 to 4:30': 'Thứ 2 to Thứ 6, 9 to 4:30',
    'Non-citizens: 855-631-0811': 'Người không phải công dân: 855-631-0811',
    'Spanish available': 'Có tiếng Tây Ban Nha',
    'Suburban Cook': 'Ngoại ô Cook',
  },
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 44)
}

function ResCard({ card }: { card: ResourceCard }) {
  const { language } = useLanguage()
  const className = card.featured ? 'res-card featured' : 'res-card'
  const tagClass = card.featured ? 'res-card-tag featured-tag' : 'res-card-tag'
  const desc = language === 'en' ? card.desc : (DESC_I18N[language]?.[card.desc] ?? card.desc)
  const tag = language === 'en' ? card.tag : (TAG_I18N[language]?.[card.tag] ?? card.tag)
  const meta = (m?: string) => !m || language === 'en' ? m : (META_I18N[language]?.[m] ?? m)
  return (
    <div className={className} data-readable>
      <div className="res-card-head">
        <h3 className="res-card-name">
          {card.href
            ? <a href={card.href} target="_blank" rel="noopener">{card.name}</a>
            : card.name}
        </h3>
        <span className={tagClass}>{tag}</span>
      </div>
      <p className="res-card-desc">{desc}</p>
      <div className="res-card-foot">
        <div className="res-card-meta">
          <span>{meta(card.meta[0])}</span>
          <span>{meta(card.meta[1])}</span>
        </div>
        <ReadAloud id={`res-card-${slugify(card.name)}`} />
      </div>
    </div>
  )
}

// Directory categories, color-coded to tie the 4 core topics to their identity
// on the home page and topic pages; the rest use brand tones for scannability.
const RES_CATEGORIES: { id: string; key: string; ra: string; data: ResourceCard[]; accent: string; icon: IconName }[] = [
  { id: 'housing-orgs', key: 'housing', ra: 'res-housing', data: HOUSING, accent: 'var(--burgundy)', icon: 'home' },
  { id: 'money-orgs', key: 'money', ra: 'res-money', data: MONEY, accent: 'var(--clover)', icon: 'money' },
  { id: 'repair-orgs', key: 'repairs', ra: 'res-repair', data: REPAIRS, accent: 'var(--midnight)', icon: 'wrench' },
  { id: 'benefits-orgs', key: 'benefits', ra: 'res-benefits', data: BENEFITS, accent: '#B8451F', icon: 'benefits' },
  { id: 'court-orgs', key: 'court', ra: 'res-court', data: COURT, accent: 'var(--midnight)', icon: 'book' },
  { id: 'safety-orgs', key: 'safety', ra: 'res-safety', data: SAFETY, accent: 'var(--burgundy)', icon: 'support' },
  { id: 'veteran-orgs', key: 'veterans', ra: 'res-veterans', data: VETERANS, accent: 'var(--clover)', icon: 'user' },
  { id: 'lgbtq-orgs', key: 'lgbtq', ra: 'res-lgbtq', data: LGBTQ, accent: '#B8451F', icon: 'like' },
]

export default function Resources() {
  const { t, language } = useLanguage()
  const bringCards = BRING_CARDS[language] ?? BRING_CARDS.en
  return (
    <>
      <SkipLink />
      <LanguageStrip />
      <SiteHeader />

      <header className="topic-page-hero" role="banner" data-readable>
        <div className="topic-page-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">{t('nav.home')}</Link> · {t('nav.resources')}
          </nav>
          <div className="topic-hero-icon-wrap" aria-hidden="true">
            <Icon name="phone-ringing" size={36} />
          </div>
          <p className="eyebrow">{t('res.hero.eyebrow')}</p>
          <div className="section-head">
            <h1 className="serif topic-page-title">{t('res.hero.title')}</h1>
            <ReadAloud id="res-hero" />
          </div>
          <p className="topic-page-sub">{t('res.hero.sub')}</p>
        </div>
      </header>

      <main id="main">

        <FindHelpNearMe />

        <section className="section section-cream" aria-labelledby="start-here" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('res.featured.eyebrow')}</p>
            <div className="section-head">
              <h2 id="start-here" className="serif section-title">{t('res.featured.title')}</h2>
              <ReadAloud id="res-start" />
            </div>
            <p className="section-sub">{t('res.featured.sub')}</p>
            <div className="res-grid">
              {FEATURED.map((c, i) => <ResCard key={i} card={c} />)}
            </div>
          </div>
        </section>

        {RES_CATEGORIES.map((cat) => (
          <section className="res-section" key={cat.id} aria-labelledby={cat.id} data-readable>
            <div className="res-section-inner">
              <div className="res-cat-head">
                <span className="res-cat-chip" style={{ background: cat.accent }} aria-hidden="true">
                  <Icon name={cat.icon} size={24} />
                </span>
                <div className="res-cat-headings">
                  <p className="eyebrow">{t(`res.cat.${cat.key}.eyebrow`)}</p>
                  <h2 id={cat.id} className="serif res-cat-title">{t(`res.cat.${cat.key}.title`)}</h2>
                </div>
                <ReadAloud id={cat.ra} />
              </div>
              <div className="res-grid">
                {cat.data.map((c, i) => <ResCard key={i} card={c} />)}
              </div>
            </div>
          </section>
        ))}

        <section className="section section-cream" aria-labelledby="today-list" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('res.today.eyebrow')}</p>
            <div className="section-head">
              <h2 id="today-list" className="serif section-title">{t('res.today.title')}</h2>
              <ReadAloud id="res-today" />
            </div>
            <p className="section-sub">{t('res.today.sub')}</p>

            <ol className="step-list">
              <li><strong>{t('res.today.s1.lead')}</strong>{t('res.today.s1.body')}</li>
              <li><strong>{t('res.today.s2.lead')}</strong>{t('res.today.s2.body')}</li>
              <li><strong>{t('res.today.s3.lead')}</strong>{t('res.today.s3.body')}</li>
              <li><strong>{t('res.today.s4.lead')}</strong>{t('res.today.s4.body')}</li>
              <li><strong>{t('res.today.s5.lead')}</strong>{t('res.today.s5.body')}</li>
            </ol>

            <div className="callout callout-burgundy" style={{ marginTop: '1.8rem' }}>
              <p className="callout-label">{t('res.today.calloutLabel')}</p>
              <p>{t('res.today.calloutBody')}</p>
            </div>
          </div>
        </section>

        <section className="section section-bone" aria-labelledby="bring-list" data-readable>
          <div className="section-inner">
            <p className="eyebrow">{t('res.bring.eyebrow')}</p>
            <div className="section-head">
              <h2 id="bring-list" className="serif section-title">{t('res.bring.title')}</h2>
              <ReadAloud id="res-bring" />
            </div>
            <p className="section-sub">{t('res.bring.sub')}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {bringCards.map((b, i) => <BringCard key={i} title={b.title} meta={b.meta} items={b.items} />)}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}

// "What to bring" checklists, per language. Machine-drafted, pending native review.
const BRING_CARDS: Record<Language, { title: string; meta: string; items: string[] }[]> = {
  en: [
    { title: 'For housing issues', meta: 'Eviction, deposits, repairs', items: ['Your lease (every page)', 'Any notices from your landlord', 'Photos of any conditions or damage', 'Rent receipts or proof of payment', 'Photo ID'] },
    { title: 'For debt or consumer issues', meta: 'Garnishment, collection, utilities', items: ['Account statements', 'Collection letters or notices', 'A log of calls (date, time, what said)', 'Pay stubs and proof of income', 'Photo ID'] },
    { title: 'For home repair grants', meta: 'HAFHR, HRAP, city programs', items: ['Deed to your home', 'Property tax bill', 'Proof of income for all adults', 'Photos of needed repairs', 'Contractor estimates if you have them'] },
    { title: 'For benefits issues', meta: 'SNAP, Medicaid, All Kids', items: ['Denial or termination letter', 'Application copy', 'Proof of income', 'Photo ID and Social Security cards', 'Birth certificates for children'] },
  ],
  es: [
    { title: 'Para problemas de vivienda', meta: 'Desalojo, depósitos, reparaciones', items: ['Tu contrato de renta (cada página)', 'Cualquier aviso de tu casero', 'Fotos de cualquier condición o daño', 'Recibos de renta o comprobante de pago', 'Identificación con foto'] },
    { title: 'Para deudas o problemas de consumo', meta: 'Embargo, cobros, servicios', items: ['Estados de cuenta', 'Cartas o avisos de cobro', 'Un registro de llamadas (fecha, hora, lo dicho)', 'Talones de pago y comprobante de ingresos', 'Identificación con foto'] },
    { title: 'Para ayudas de reparación del hogar', meta: 'HAFHR, HRAP, programas municipales', items: ['Escritura de tu casa', 'Factura del impuesto predial', 'Comprobante de ingresos de todos los adultos', 'Fotos de las reparaciones necesarias', 'Presupuestos de contratistas si los tienes'] },
    { title: 'Para problemas de beneficios', meta: 'SNAP, Medicaid, All Kids', items: ['Carta de negación o terminación', 'Copia de la solicitud', 'Comprobante de ingresos', 'Identificación con foto y tarjetas de Seguro Social', 'Actas de nacimiento de los niños'] },
  ],
  zh: [
    { title: '住房问题', meta: '驱逐、押金、维修', items: ['您的租约（每一页）', '房东给您的任何通知', '任何状况或损坏的照片', '租金收据或付款证明', '带照片的身份证件'] },
    { title: '债务或消费问题', meta: '工资扣押、催收、公用事业', items: ['账户对账单', '催收信件或通知', '通话记录（日期、时间、内容）', '工资单和收入证明', '带照片的身份证件'] },
    { title: '房屋维修补助', meta: 'HAFHR、HRAP、市政项目', items: ['您房屋的房契', '房产税单', '所有成年人的收入证明', '所需维修的照片', '承包商估价（如有）'] },
    { title: '福利问题', meta: 'SNAP、Medicaid、All Kids', items: ['拒绝或终止信', '申请副本', '收入证明', '带照片的身份证件和社会安全卡', '孩子的出生证明'] },
  ],
  tl: [
    { title: 'Para sa mga isyu sa pabahay', meta: 'Pagpapaalis, deposito, pag-aayos', items: ['Ang iyong lease (bawat pahina)', 'Anumang abiso mula sa iyong kasera', 'Mga litrato ng anumang kondisyon o pinsala', 'Mga resibo ng upa o patunay ng bayad', 'ID na may litrato'] },
    { title: 'Para sa utang o isyu ng consumer', meta: 'Garnishment, koleksyon, utility', items: ['Mga account statement', 'Mga sulat o abiso ng koleksyon', 'Log ng mga tawag (petsa, oras, sinabi)', 'Mga pay stub at patunay ng kita', 'ID na may litrato'] },
    { title: 'Para sa mga gawad sa pag-aayos ng bahay', meta: 'HAFHR, HRAP, mga programa ng lungsod', items: ['Titulo ng iyong bahay', 'Bill ng property tax', 'Patunay ng kita ng lahat ng adulto', 'Mga litrato ng kailangang pag-aayos', 'Mga estimate ng kontratista kung mayroon'] },
    { title: 'Para sa mga isyu sa benepisyo', meta: 'SNAP, Medicaid, All Kids', items: ['Liham ng pagtanggi o pagtatapos', 'Kopya ng aplikasyon', 'Patunay ng kita', 'ID na may litrato at mga Social Security card', 'Mga sertipiko ng kapanganakan ng mga bata'] },
  ],
  vi: [
    { title: 'Cho các vấn đề nhà ở', meta: 'Trục xuất, tiền cọc, sửa chữa', items: ['Hợp đồng thuê của bạn (mọi trang)', 'Bất kỳ thông báo nào từ chủ nhà', 'Ảnh chụp bất kỳ tình trạng hoặc hư hỏng nào', 'Biên lai tiền thuê hoặc bằng chứng thanh toán', 'Giấy tờ tùy thân có ảnh'] },
    { title: 'Cho nợ hoặc vấn đề tiêu dùng', meta: 'Khấu trừ lương, đòi nợ, tiện ích', items: ['Sao kê tài khoản', 'Thư hoặc thông báo đòi nợ', 'Nhật ký cuộc gọi (ngày, giờ, nội dung)', 'Phiếu lương và bằng chứng thu nhập', 'Giấy tờ tùy thân có ảnh'] },
    { title: 'Cho trợ cấp sửa chữa nhà', meta: 'HAFHR, HRAP, chương trình thành phố', items: ['Giấy chủ quyền nhà', 'Hóa đơn thuế tài sản', 'Bằng chứng thu nhập của mọi người lớn', 'Ảnh các chỗ cần sửa', 'Báo giá nhà thầu nếu có'] },
    { title: 'Cho các vấn đề phúc lợi', meta: 'SNAP, Medicaid, All Kids', items: ['Thư từ chối hoặc chấm dứt', 'Bản sao đơn đăng ký', 'Bằng chứng thu nhập', 'Giấy tờ tùy thân có ảnh và thẻ An sinh Xã hội', 'Giấy khai sinh của trẻ em'] },
  ],
}

function BringCard({ title, meta, items }: { title: string; meta: string; items: string[] }) {
  return (
    <article className="program-card">
      <h3 className="program-name">{title}</h3>
      <p className="program-meta">{meta}</p>
      <ul className="bring-doc-list">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </article>
  )
}
