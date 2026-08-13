import { TopicPage } from '../components/TopicPage'
import { useLanguage, Language } from '../lib/translations'

// Per-language content for the Home Repairs topic page. English is the source
// of truth; es/zh/tl/vi are machine-drafted and PENDING NATIVE-SPEAKER REVIEW.
// Program names and dollar amounts stay verbatim; descriptors are translated.

interface FAQ { q: string; a: string; source: string }
interface Program { name: string; amount: string; meta: string; body: string; cta: string; meta2: string }
interface Step { title: string; body: string }
interface Referral {
  sticker: string; title: string; orgName: string; orgSub: string; orgDesc: string
  websiteLabel: string; website: string; hoursLabel: string; hours: string
  bringLabel: string; bring: string[]; startBtn: string; otherBtn: string
}
interface TopicContent {
  parentLabel: string; eyebrow: string; title: string; sub: string
  quickNav: { id: string; label: string }[]
  summary: string; faqs: FAQ[]; programs: Program[]; steps: Step[]; referral: Referral
}

const CONTENT: Record<'en', TopicContent> & Partial<Record<Language, TopicContent>> = {
  en: {
    parentLabel: 'Home Repairs',
    eyebrow: 'Home repairs',
    title: 'Grants to fix up your home.',
    sub: 'Free and low-cost programs for roof, heating, plumbing, accessibility, and emergency repairs in Illinois.',
    quickNav: [
      { id: 'summary', label: 'Summary' },
      { id: 'questions', label: 'Common questions' },
      { id: 'programs', label: 'Programs' },
      { id: 'action', label: 'What to do' },
      { id: 'help', label: 'Get help' },
    ],
    summary: 'Many Illinois homeowners, especially elderly homeowners and those on fixed incomes, live in deteriorating homes because they cannot afford essential repairs. Federal, state, city, and nonprofit programs offer grants and zero-interest loans to fix roofs, replace furnaces, repair plumbing, and add accessibility features. These programs are scattered across many agencies, so this guide brings them together.',
    faqs: [
      { q: 'I am 65 and need to fix my porch but cannot afford it. Are there programs that help?', a: 'Yes. In Chicago, the Department of Family and Support Services runs the Small Accessible Repairs for Seniors program for residents 60 and over who earn up to 80% of area median income. The state IHDA Home Repair Program also serves elderly homeowners up to $45,000 in repairs.', source: 'City of Chicago DFSS, Illinois Housing Development Authority' },
      { q: 'My furnace broke in winter. What emergency help is available?', a: 'In Chicago, the Emergency Heating Repair Program offers grants averaging $7,000 for emergency heating system repairs during the cold weather months. LIHEAP also has an emergency furnace component.', source: 'City of Chicago Department of Housing, Illinois LIHEAP' },
      { q: 'I use a wheelchair and need a ramp at my home. Can the city help?', a: "Chicago HomeMod, run by the Mayor's Office for People with Disabilities, provides up to $10,000 in accessibility modifications including ramps, grab bars, and bathroom adaptations. UCP Seguin Ramp Up Foundation also builds ramps for free for income-eligible residents.", source: 'Chicago MOPD HomeMod Program' },
      { q: 'What does HAFHR cover?', a: 'The Illinois Homeowner Assistance Fund Home Repair Program provides up to $60,000 for critical repairs to households earning at or below 150% of area median income who experienced financial hardship during the pandemic. It covers roof, plumbing, electrical, and lead paint remediation.', source: 'Illinois Housing Development Authority' },
    ],
    programs: [
      { name: 'Small Accessible Repairs for Seniors (SARFS)', amount: 'Grant', meta: 'Chicago · Age 60+', body: 'Grants for Chicago seniors at or below 80% of area median income for small repairs like steps, porches, gutters, ramps, and grab bars. No repayment required.', cta: 'Apply via DFSS', meta2: 'Chicago residents only' },
      { name: 'Emergency Heating Repair Program (EHRP)', amount: '~$7,000', meta: 'Chicago · Winter only', body: 'Grants for emergency furnace and boiler repairs during heating season. Applications open every fall and serve income-eligible homeowners.', cta: 'Apply now', meta2: 'Chicago residents only' },
      { name: 'IHDA Home Repair Program (HRAP)', amount: 'Up to $45,000', meta: 'Statewide · IHDA', body: 'Forgivable loans for health, safety, accessibility, and energy efficiency repairs. Serves low and very low income homeowners across Illinois.', cta: 'Apply via IHDA', meta2: 'Statewide eligibility' },
      { name: 'Homeowner Assistance Fund Home Repair (HAFHR)', amount: 'Up to $60,000', meta: 'Statewide · COVID-related', body: 'Up to $60,000 for critical repairs for households at or below 150% AMI who experienced COVID-related financial hardship. Administered through Habitat for Humanity and NHS affiliates.', cta: 'Check eligibility', meta2: 'Up to 150% AMI' },
      { name: 'USDA Section 504 Home Repair Program', amount: 'Up to $10,000', meta: 'Federal · Rural areas', body: 'Grants and loans for very low income homeowners in rural areas. Grants are limited to those 62 and older who cannot repay a loan.', cta: 'Apply via USDA', meta2: 'Rural Illinois only' },
      { name: 'Chicago HomeMod Program', amount: 'Up to $10,000', meta: 'Chicago · Disability', body: 'Accessibility modifications for Chicago residents with disabilities. Covers ramps, lifts, grab bars, accessible bathrooms, and door widening.', cta: 'Apply via MOPD', meta2: 'Chicago residents only' },
    ],
    steps: [
      { title: 'Start with HAFHR or HRAP.', body: 'They cover the most repair types and the largest amounts, so many homeowners apply to these programs first.' },
      { title: 'Apply for multiple programs at once.', body: 'Programs can be combined in many cases. The earlier you apply, the better your odds before funds run out for the year.' },
      { title: 'Get a written estimate.', body: 'Most programs require at least one contractor estimate. Pick licensed contractors and keep all paperwork.' },
      { title: 'Document the need.', body: 'Take photos of the problem before any work starts. Save any inspector reports or letters from your utility company.' },
      { title: 'If you are 60 or older, ask about senior programs first.', body: 'Programs like SARFS and Section 504 grants are easier to qualify for if you are an elderly homeowner.' },
    ],
    referral: {
      sticker: 'Start here', title: 'Chicagoland Habitat for Humanity',
      orgName: 'HAFHR program administrator', orgSub: 'Helps with the IHDA Homeowner Assistance Fund application',
      orgDesc: 'Habitat for Humanity is the official administrator for HAFHR in the Chicago region. They help you complete the application, work with contractors, and make sure your repairs meet the program standards.',
      websiteLabel: 'Website', website: 'chicagolandhabitat.org', hoursLabel: 'Hours', hours: 'Mon to Fri, 9 to 5',
      bringLabel: 'Bring these with you', bring: ['Deed to your home', 'Property tax bill', 'Photo ID', 'Proof of income', 'Photos of repairs needed'],
      startBtn: 'Start your application →', otherBtn: 'Find another program',
    },
  },

  es: {
    parentLabel: 'Reparaciones del hogar',
    eyebrow: 'Reparaciones del hogar',
    title: 'Ayudas para arreglar tu casa.',
    sub: 'Programas gratuitos y de bajo costo para techo, calefacción, plomería, accesibilidad y reparaciones de emergencia en Illinois.',
    quickNav: [
      { id: 'summary', label: 'Resumen' },
      { id: 'questions', label: 'Preguntas comunes' },
      { id: 'programs', label: 'Programas' },
      { id: 'action', label: 'Qué hacer' },
      { id: 'help', label: 'Busca ayuda' },
    ],
    summary: 'Muchos propietarios de Illinois, especialmente los adultos mayores y quienes tienen ingresos fijos, viven en casas que se deterioran porque no pueden pagar reparaciones esenciales. Programas federales, estatales, municipales y sin fines de lucro ofrecen ayudas y préstamos sin interés para arreglar techos, reemplazar calefacciones, reparar plomería y agregar accesibilidad. Estos programas están dispersos en muchas agencias, así que esta guía los reúne.',
    faqs: [
      { q: 'Tengo 65 años y necesito arreglar mi porche pero no puedo pagarlo. ¿Hay programas que ayuden?', a: 'Sí. En Chicago, el Departamento de Servicios para la Familia y de Apoyo dirige el programa Pequeñas Reparaciones Accesibles para Personas Mayores para residentes de 60 años o más que ganan hasta el 80% del ingreso medio del área. El programa estatal IHDA de Reparación del Hogar también atiende a propietarios mayores con hasta $45,000 en reparaciones.', source: 'City of Chicago DFSS, Illinois Housing Development Authority' },
      { q: 'Mi calefacción se descompuso en invierno. ¿Qué ayuda de emergencia hay?', a: 'En Chicago, el Programa de Reparación de Calefacción de Emergencia ofrece ayudas de un promedio de $7,000 para reparaciones de emergencia del sistema de calefacción durante los meses fríos. LIHEAP también tiene un componente de calefacción de emergencia.', source: 'City of Chicago Department of Housing, Illinois LIHEAP' },
      { q: 'Uso silla de ruedas y necesito una rampa en mi casa. ¿La ciudad puede ayudar?', a: 'Chicago HomeMod, dirigido por la Oficina del Alcalde para Personas con Discapacidades, ofrece hasta $10,000 en modificaciones de accesibilidad, incluyendo rampas, barras de apoyo y adaptaciones de baño. La Fundación UCP Seguin Ramp Up también construye rampas gratis para residentes que califican por ingresos.', source: 'Chicago MOPD HomeMod Program' },
      { q: '¿Qué cubre HAFHR?', a: 'El Programa de Reparación del Hogar del Fondo de Asistencia para Propietarios de Illinois ofrece hasta $60,000 para reparaciones críticas a hogares que ganan al 150% o menos del ingreso medio del área y que tuvieron dificultades financieras durante la pandemia. Cubre techo, plomería, electricidad y remoción de pintura con plomo.', source: 'Illinois Housing Development Authority' },
    ],
    programs: [
      { name: 'Small Accessible Repairs for Seniors (SARFS)', amount: 'Subvención', meta: 'Chicago · 60+ años', body: 'Ayudas para personas mayores de Chicago al 80% o menos del ingreso medio del área para reparaciones pequeñas como escalones, porches, canaletas, rampas y barras de apoyo. Sin reembolso.', cta: 'Solicitar vía DFSS', meta2: 'Solo residentes de Chicago' },
      { name: 'Emergency Heating Repair Program (EHRP)', amount: '~$7,000', meta: 'Chicago · Solo invierno', body: 'Ayudas para reparaciones de emergencia de calefacciones y calderas durante la temporada de calefacción. Las solicitudes abren cada otoño y atienden a propietarios que califican por ingresos.', cta: 'Solicitar ahora', meta2: 'Solo residentes de Chicago' },
      { name: 'IHDA Home Repair Program (HRAP)', amount: 'Hasta $45,000', meta: 'Estatal · IHDA', body: 'Préstamos condonables para reparaciones de salud, seguridad, accesibilidad y eficiencia energética. Atiende a propietarios de bajos y muy bajos ingresos en todo Illinois.', cta: 'Solicitar vía IHDA', meta2: 'Elegibilidad estatal' },
      { name: 'Homeowner Assistance Fund Home Repair (HAFHR)', amount: 'Hasta $60,000', meta: 'Estatal · Relacionado con COVID', body: 'Hasta $60,000 para reparaciones críticas para hogares al 150% AMI o menos que tuvieron dificultades financieras por COVID. Administrado por Habitat for Humanity y afiliados de NHS.', cta: 'Verificar elegibilidad', meta2: 'Hasta 150% AMI' },
      { name: 'USDA Section 504 Home Repair Program', amount: 'Hasta $10,000', meta: 'Federal · Zonas rurales', body: 'Ayudas y préstamos para propietarios de muy bajos ingresos en zonas rurales. Las ayudas se limitan a personas de 62 años o más que no pueden pagar un préstamo.', cta: 'Solicitar vía USDA', meta2: 'Solo zonas rurales de Illinois' },
      { name: 'Chicago HomeMod Program', amount: 'Hasta $10,000', meta: 'Chicago · Discapacidad', body: 'Modificaciones de accesibilidad para residentes de Chicago con discapacidades. Cubre rampas, elevadores, barras de apoyo, baños accesibles y ensanchamiento de puertas.', cta: 'Solicitar vía MOPD', meta2: 'Solo residentes de Chicago' },
    ],
    steps: [
      { title: 'Empieza con HAFHR o HRAP.', body: 'Cubren la mayoría de los tipos de reparación y los montos más altos, por lo que muchos propietarios solicitan estos programas primero.' },
      { title: 'Solicita varios programas a la vez.', body: 'En muchos casos los programas se pueden combinar. Cuanto antes solicites, mejores tus probabilidades antes de que se acaben los fondos del año.' },
      { title: 'Consigue un presupuesto por escrito.', body: 'La mayoría de los programas requieren al menos un presupuesto de un contratista. Elige contratistas con licencia y guarda todos los documentos.' },
      { title: 'Documenta la necesidad.', body: 'Toma fotos del problema antes de que empiece cualquier trabajo. Guarda los informes de inspectores o cartas de tu compañía de servicios.' },
      { title: 'Si tienes 60 años o más, pregunta primero por programas para mayores.', body: 'Programas como SARFS y las ayudas de la Sección 504 son más fáciles de calificar si eres un propietario mayor.' },
    ],
    referral: {
      sticker: 'Empieza aquí', title: 'Chicagoland Habitat for Humanity',
      orgName: 'Administrador del programa HAFHR', orgSub: 'Ayuda con la solicitud del Fondo de Asistencia para Propietarios de IHDA',
      orgDesc: 'Habitat for Humanity es el administrador oficial de HAFHR en la región de Chicago. Te ayudan a completar la solicitud, trabajar con contratistas y asegurar que tus reparaciones cumplan los estándares del programa.',
      websiteLabel: 'Sitio web', website: 'chicagolandhabitat.org', hoursLabel: 'Horario', hours: 'Lun to Vie, 9 to 5',
      bringLabel: 'Lleva esto contigo', bring: ['Escritura de tu casa', 'Factura del impuesto predial', 'Identificación con foto', 'Comprobante de ingresos', 'Fotos de las reparaciones necesarias'],
      startBtn: 'Empieza tu solicitud →', otherBtn: 'Buscar otro programa',
    },
  },

  zh: {
    parentLabel: '房屋维修',
    eyebrow: '房屋维修',
    title: '修缮房屋的补助。',
    sub: '伊利诺伊州为屋顶、供暖、管道、无障碍和紧急维修提供的免费及低成本项目。',
    quickNav: [
      { id: 'summary', label: '摘要' },
      { id: 'questions', label: '常见问题' },
      { id: 'programs', label: '项目' },
      { id: 'action', label: '该做什么' },
      { id: 'help', label: '获取帮助' },
    ],
    summary: '许多伊利诺伊州房主，尤其是老年房主和固定收入者，由于负担不起必要的维修而住在日益破败的房屋中。联邦、州、市和非营利项目提供补助和零利息贷款，用于修屋顶、更换炉子、修管道和增加无障碍设施。这些项目分散在许多机构中，因此本指南将它们汇集在一起。',
    faqs: [
      { q: '我65岁，需要修门廊但负担不起。有帮助的项目吗？', a: '有。在芝加哥，家庭与支持服务部为60岁及以上、收入不超过地区中位收入80%的居民开办“老年人小型无障碍维修”项目。州 IHDA 房屋维修项目也为老年房主提供最高 $45,000 的维修。', source: 'City of Chicago DFSS, Illinois Housing Development Authority' },
      { q: '我的炉子在冬天坏了。有什么紧急帮助？', a: '在芝加哥，紧急供暖维修项目在寒冷月份为紧急供暖系统维修提供平均 $7,000 的补助。LIHEAP 也有紧急炉子部分。', source: 'City of Chicago Department of Housing, Illinois LIHEAP' },
      { q: '我使用轮椅，家里需要一个坡道。市里能帮忙吗？', a: '由市长残障人士办公室运营的 Chicago HomeMod 提供最高 $10,000 的无障碍改造，包括坡道、扶手和浴室改造。UCP Seguin Ramp Up 基金会也为符合收入条件的居民免费建造坡道。', source: 'Chicago MOPD HomeMod Program' },
      { q: 'HAFHR 涵盖什么？', a: '伊利诺伊州房主援助基金房屋维修项目为收入在地区中位收入150%或以下、且在疫情期间经历经济困难的家庭提供最高 $60,000 的关键维修。它涵盖屋顶、管道、电气和含铅油漆清除。', source: 'Illinois Housing Development Authority' },
    ],
    programs: [
      { name: 'Small Accessible Repairs for Seniors (SARFS)', amount: '补助', meta: '芝加哥 · 60岁以上', body: '为收入在地区中位收入80%或以下的芝加哥老年人提供小型维修补助，如台阶、门廊、排水沟、坡道和扶手。无需偿还。', cta: '通过 DFSS 申请', meta2: '仅限芝加哥居民' },
      { name: 'Emergency Heating Repair Program (EHRP)', amount: '~$7,000', meta: '芝加哥 · 仅冬季', body: '在供暖季为紧急炉子和锅炉维修提供补助。申请每年秋季开放，服务符合收入条件的房主。', cta: '立即申请', meta2: '仅限芝加哥居民' },
      { name: 'IHDA Home Repair Program (HRAP)', amount: '最高 $45,000', meta: '全州 · IHDA', body: '为健康、安全、无障碍和能效维修提供可免还贷款。服务全伊利诺伊州的低收入和极低收入房主。', cta: '通过 IHDA 申请', meta2: '全州资格' },
      { name: 'Homeowner Assistance Fund Home Repair (HAFHR)', amount: '最高 $60,000', meta: '全州 · 与COVID相关', body: '为收入在150% AMI或以下、且经历与COVID相关经济困难的家庭提供最高 $60,000 的关键维修。通过 Habitat for Humanity 和 NHS 附属机构管理。', cta: '查看资格', meta2: '最高 150% AMI' },
      { name: 'USDA Section 504 Home Repair Program', amount: '最高 $10,000', meta: '联邦 · 农村地区', body: '为农村地区极低收入房主提供补助和贷款。补助仅限于无法偿还贷款的62岁及以上人士。', cta: '通过 USDA 申请', meta2: '仅限伊利诺伊州农村' },
      { name: 'Chicago HomeMod Program', amount: '最高 $10,000', meta: '芝加哥 · 残障', body: '为芝加哥残障居民提供无障碍改造。涵盖坡道、升降机、扶手、无障碍浴室和加宽门。', cta: '通过 MOPD 申请', meta2: '仅限芝加哥居民' },
    ],
    steps: [
      { title: '从 HAFHR 或 HRAP 开始。', body: '它们涵盖最多的维修类型和最高的金额，因此许多房主会先申请这些项目。' },
      { title: '同时申请多个项目。', body: '许多情况下项目可以合并。申请越早，在当年资金用完之前成功的机会越大。' },
      { title: '获取书面估价。', body: '大多数项目要求至少一份承包商估价。选择有执照的承包商并保留所有文件。' },
      { title: '记录需求。', body: '在任何工作开始前给问题拍照。保存任何检查员报告或公用事业公司的信件。' },
      { title: '如果您60岁或以上，先询问老年项目。', body: '如果您是老年房主，像 SARFS 和 504 条款补助这样的项目更容易符合资格。' },
    ],
    referral: {
      sticker: '从这里开始', title: 'Chicagoland Habitat for Humanity',
      orgName: 'HAFHR 项目管理方', orgSub: '协助办理 IHDA 房主援助基金申请',
      orgDesc: 'Habitat for Humanity 是芝加哥地区 HAFHR 的官方管理方。他们帮助您完成申请、与承包商合作，并确保您的维修符合项目标准。',
      websiteLabel: '网站', website: 'chicagolandhabitat.org', hoursLabel: '时间', hours: '周一至周五, 9 to 5',
      bringLabel: '请带上这些', bring: ['您房屋的房契', '房产税单', '带照片的身份证件', '收入证明', '所需维修的照片'],
      startBtn: '开始申请 →', otherBtn: '查找其他项目',
    },
  },

  tl: {
    parentLabel: 'Pag-aayos ng bahay',
    eyebrow: 'Pag-aayos ng bahay',
    title: 'Mga tulong para ayusin ang iyong bahay.',
    sub: 'Libre at murang programa para sa bubong, pampainit, tubo, accessibility, at emergency na pag-aayos sa Illinois.',
    quickNav: [
      { id: 'summary', label: 'Buod' },
      { id: 'questions', label: 'Karaniwang tanong' },
      { id: 'programs', label: 'Mga programa' },
      { id: 'action', label: 'Ano ang gagawin' },
      { id: 'help', label: 'Humingi ng tulong' },
    ],
    summary: 'Maraming may-ari ng bahay sa Illinois, lalo na ang mga matatanda at may takdang kita, ay nakatira sa sumisirang bahay dahil hindi nila kayang bayaran ang mahahalagang pag-aayos. Ang mga programang pederal, pang-estado, pang-lungsod, at nonprofit ay nag-aalok ng tulong at walang-interes na pautang para ayusin ang bubong, palitan ang pampainit, ayusin ang tubo, at magdagdag ng accessibility. Nakakalat ang mga programang ito sa maraming ahensya, kaya tinitipon sila ng gabay na ito.',
    faqs: [
      { q: '65 taong gulang ako at kailangan kong ayusin ang porch ko pero hindi ko kaya. May mga programa bang tumutulong?', a: 'Oo. Sa Chicago, pinapatakbo ng Department of Family and Support Services ang Small Accessible Repairs for Seniors para sa mga residenteng 60 pataas na kumikita ng hanggang 80% ng area median income. Ang pang-estadong IHDA Home Repair Program ay naglilingkod din sa mga matatandang may-ari ng bahay na may hanggang $45,000 na pag-aayos.', source: 'City of Chicago DFSS, Illinois Housing Development Authority' },
      { q: 'Sumira ang pampainit ko sa taglamig. Anong emergency na tulong ang available?', a: 'Sa Chicago, nag-aalok ang Emergency Heating Repair Program ng tulong na may average na $7,000 para sa emergency na pag-aayos ng sistema ng pampainit sa malamig na mga buwan. May emergency na bahagi rin para sa pampainit ang LIHEAP.', source: 'City of Chicago Department of Housing, Illinois LIHEAP' },
      { q: 'Gumagamit ako ng wheelchair at kailangan ko ng ramp sa bahay. Makakatulong ba ang lungsod?', a: 'Ang Chicago HomeMod, na pinapatakbo ng Mayor’s Office for People with Disabilities, ay nagbibigay ng hanggang $10,000 sa mga pagbabago para sa accessibility kabilang ang ramp, grab bar, at pag-angkop ng banyo. Ang UCP Seguin Ramp Up Foundation ay gumagawa rin ng libreng ramp para sa mga residenteng kwalipikado ayon sa kita.', source: 'Chicago MOPD HomeMod Program' },
      { q: 'Ano ang saklaw ng HAFHR?', a: 'Ang Illinois Homeowner Assistance Fund Home Repair Program ay nagbibigay ng hanggang $60,000 para sa kritikal na pag-aayos sa mga sambahayang kumikita ng 150% AMI pababa na nakaranas ng kahirapang pinansyal noong pandemya. Saklaw nito ang bubong, tubo, kuryente, at pag-aalis ng lead paint.', source: 'Illinois Housing Development Authority' },
    ],
    programs: [
      { name: 'Small Accessible Repairs for Seniors (SARFS)', amount: 'Gawad', meta: 'Chicago · Edad 60+', body: 'Tulong para sa mga matatanda sa Chicago na 80% pababa ng area median income para sa maliliit na pag-aayos tulad ng hagdan, porch, gutter, ramp, at grab bar. Walang kailangang bayaran.', cta: 'Mag-apply sa DFSS', meta2: 'Mga residente ng Chicago lang' },
      { name: 'Emergency Heating Repair Program (EHRP)', amount: '~$7,000', meta: 'Chicago · Taglamig lang', body: 'Tulong para sa emergency na pag-aayos ng pampainit at boiler sa panahon ng pag-init. Bumubukas ang aplikasyon tuwing taglagas at naglilingkod sa mga may-aring kwalipikado ayon sa kita.', cta: 'Mag-apply ngayon', meta2: 'Mga residente ng Chicago lang' },
      { name: 'IHDA Home Repair Program (HRAP)', amount: 'Hanggang $45,000', meta: 'Buong estado · IHDA', body: 'Mapapatawad na pautang para sa pag-aayos sa kalusugan, kaligtasan, accessibility, at energy efficiency. Naglilingkod sa mababa at napakababang kita na may-ari sa buong Illinois.', cta: 'Mag-apply sa IHDA', meta2: 'Pagiging karapat-dapat sa buong estado' },
      { name: 'Homeowner Assistance Fund Home Repair (HAFHR)', amount: 'Hanggang $60,000', meta: 'Buong estado · Kaugnay ng COVID', body: 'Hanggang $60,000 para sa kritikal na pag-aayos para sa mga sambahayang 150% AMI pababa na nakaranas ng kahirapang pinansyal na kaugnay ng COVID. Pinamamahalaan sa pamamagitan ng Habitat for Humanity at mga kasangga ng NHS.', cta: 'Tingnan ang pagiging karapat-dapat', meta2: 'Hanggang 150% AMI' },
      { name: 'USDA Section 504 Home Repair Program', amount: 'Hanggang $10,000', meta: 'Pederal · Mga rural na lugar', body: 'Tulong at pautang para sa napakababang kita na may-ari sa mga rural na lugar. Ang tulong ay limitado sa mga 62 pataas na hindi makakabayad ng pautang.', cta: 'Mag-apply sa USDA', meta2: 'Rural na Illinois lang' },
      { name: 'Chicago HomeMod Program', amount: 'Hanggang $10,000', meta: 'Chicago · Kapansanan', body: 'Mga pagbabago para sa accessibility para sa mga residente ng Chicago na may kapansanan. Saklaw ang ramp, lift, grab bar, accessible na banyo, at pagpapalapad ng pinto.', cta: 'Mag-apply sa MOPD', meta2: 'Mga residente ng Chicago lang' },
    ],
    steps: [
      { title: 'Magsimula sa HAFHR o HRAP.', body: 'Sinasaklaw ng mga ito ang pinakamaraming uri ng pag-aayos at pinakamalaking halaga, kaya marami ang nag-a-apply muna sa mga programang ito.' },
      { title: 'Mag-apply sa maraming programa nang sabay.', body: 'Sa maraming kaso, maaaring pagsamahin ang mga programa. Kung mas maaga kang mag-apply, mas malaki ang tsansa mo bago maubos ang pondo para sa taon.' },
      { title: 'Kumuha ng nakasulat na estimate.', body: 'Karamihan ng programa ay nangangailangan ng kahit isang estimate ng kontratista. Pumili ng lisensyadong kontratista at itago ang lahat ng papeles.' },
      { title: 'Idokumento ang pangangailangan.', body: 'Kumuha ng litrato ng problema bago magsimula ang anumang trabaho. I-save ang anumang ulat ng inspektor o liham mula sa iyong kompanya ng utility.' },
      { title: 'Kung 60 pataas ka, magtanong muna tungkol sa mga programa para sa matatanda.', body: 'Mas madaling maging kwalipikado sa mga programa tulad ng SARFS at mga gawad ng Section 504 kung ikaw ay matandang may-ari ng bahay.' },
    ],
    referral: {
      sticker: 'Magsimula dito', title: 'Chicagoland Habitat for Humanity',
      orgName: 'Tagapamahala ng programang HAFHR', orgSub: 'Tumutulong sa aplikasyon ng IHDA Homeowner Assistance Fund',
      orgDesc: 'Ang Habitat for Humanity ang opisyal na tagapamahala ng HAFHR sa rehiyon ng Chicago. Tinutulungan ka nilang kumpletuhin ang aplikasyon, makipagtulungan sa mga kontratista, at tiyaking naaabot ng iyong pag-aayos ang mga pamantayan ng programa.',
      websiteLabel: 'Website', website: 'chicagolandhabitat.org', hoursLabel: 'Oras', hours: 'Lun to Biy, 9 to 5',
      bringLabel: 'Dalhin ang mga ito', bring: ['Titulo ng iyong bahay', 'Bill ng property tax', 'ID na may litrato', 'Patunay ng kita', 'Mga litrato ng pag-aayos na kailangan'],
      startBtn: 'Simulan ang iyong aplikasyon →', otherBtn: 'Maghanap ng ibang programa',
    },
  },

  vi: {
    parentLabel: 'Sửa chữa nhà',
    eyebrow: 'Sửa chữa nhà',
    title: 'Trợ cấp để sửa sang nhà của bạn.',
    sub: 'Các chương trình miễn phí và chi phí thấp cho mái nhà, sưởi, ống nước, tiếp cận, và sửa chữa khẩn cấp ở Illinois.',
    quickNav: [
      { id: 'summary', label: 'Tóm tắt' },
      { id: 'questions', label: 'Câu hỏi thường gặp' },
      { id: 'programs', label: 'Chương trình' },
      { id: 'action', label: 'Việc cần làm' },
      { id: 'help', label: 'Nhận trợ giúp' },
    ],
    summary: 'Nhiều chủ nhà ở Illinois, đặc biệt là người cao tuổi và người có thu nhập cố định, sống trong những ngôi nhà xuống cấp vì không đủ khả năng sửa chữa thiết yếu. Các chương trình liên bang, bang, thành phố và phi lợi nhuận cung cấp trợ cấp và khoản vay không lãi để sửa mái, thay lò sưởi, sửa ống nước, và bổ sung tính năng tiếp cận. Các chương trình này nằm rải rác ở nhiều cơ quan, nên hướng dẫn này tập hợp chúng lại.',
    faqs: [
      { q: 'Tôi 65 tuổi và cần sửa hiên nhà nhưng không đủ tiền. Có chương trình nào giúp không?', a: 'Có. Tại Chicago, Sở Dịch vụ Gia đình và Hỗ trợ điều hành chương trình Sửa chữa Nhỏ Dễ Tiếp cận cho Người Cao tuổi dành cho cư dân từ 60 tuổi trở lên có thu nhập đến 80% thu nhập trung vị khu vực. Chương trình Sửa chữa Nhà IHDA của bang cũng phục vụ chủ nhà cao tuổi với mức sửa chữa đến $45,000.', source: 'City of Chicago DFSS, Illinois Housing Development Authority' },
      { q: 'Lò sưởi của tôi hỏng vào mùa đông. Có trợ giúp khẩn cấp nào không?', a: 'Tại Chicago, Chương trình Sửa chữa Sưởi Khẩn cấp cung cấp trợ cấp trung bình $7,000 cho việc sửa hệ thống sưởi khẩn cấp trong những tháng lạnh. LIHEAP cũng có phần lò sưởi khẩn cấp.', source: 'City of Chicago Department of Housing, Illinois LIHEAP' },
      { q: 'Tôi dùng xe lăn và cần một đường dốc tại nhà. Thành phố có giúp được không?', a: 'Chicago HomeMod, do Văn phòng Thị trưởng dành cho Người Khuyết tật điều hành, cung cấp đến $10,000 cho các sửa đổi tiếp cận gồm đường dốc, thanh vịn, và điều chỉnh phòng tắm. Quỹ UCP Seguin Ramp Up cũng xây đường dốc miễn phí cho cư dân đủ điều kiện thu nhập.', source: 'Chicago MOPD HomeMod Program' },
      { q: 'HAFHR bao gồm những gì?', a: 'Chương trình Sửa chữa Nhà của Quỹ Hỗ trợ Chủ nhà Illinois cung cấp đến $60,000 cho các sửa chữa quan trọng cho các hộ có thu nhập từ 150% thu nhập trung vị khu vực trở xuống đã gặp khó khăn tài chính trong đại dịch. Nó bao gồm mái nhà, ống nước, điện, và xử lý sơn chì.', source: 'Illinois Housing Development Authority' },
    ],
    programs: [
      { name: 'Small Accessible Repairs for Seniors (SARFS)', amount: 'Trợ cấp', meta: 'Chicago · Tuổi 60+', body: 'Trợ cấp cho người cao tuổi ở Chicago có thu nhập 80% trở xuống của thu nhập trung vị khu vực cho các sửa chữa nhỏ như bậc thang, hiên nhà, máng xối, đường dốc, và thanh vịn. Không cần hoàn trả.', cta: 'Đăng ký qua DFSS', meta2: 'Chỉ cư dân Chicago' },
      { name: 'Emergency Heating Repair Program (EHRP)', amount: '~$7,000', meta: 'Chicago · Chỉ mùa đông', body: 'Trợ cấp cho việc sửa lò sưởi và nồi hơi khẩn cấp trong mùa sưởi. Đơn đăng ký mở mỗi mùa thu và phục vụ chủ nhà đủ điều kiện thu nhập.', cta: 'Đăng ký ngay', meta2: 'Chỉ cư dân Chicago' },
      { name: 'IHDA Home Repair Program (HRAP)', amount: 'Lên đến $45,000', meta: 'Toàn bang · IHDA', body: 'Khoản vay có thể được xóa cho sửa chữa về sức khỏe, an toàn, tiếp cận, và hiệu quả năng lượng. Phục vụ chủ nhà thu nhập thấp và rất thấp trên khắp Illinois.', cta: 'Đăng ký qua IHDA', meta2: 'Đủ điều kiện toàn bang' },
      { name: 'Homeowner Assistance Fund Home Repair (HAFHR)', amount: 'Lên đến $60,000', meta: 'Toàn bang · Liên quan COVID', body: 'Lên đến $60,000 cho sửa chữa quan trọng cho các hộ từ 150% AMI trở xuống đã gặp khó khăn tài chính liên quan COVID. Quản lý qua Habitat for Humanity và các chi nhánh NHS.', cta: 'Kiểm tra điều kiện', meta2: 'Lên đến 150% AMI' },
      { name: 'USDA Section 504 Home Repair Program', amount: 'Lên đến $10,000', meta: 'Liên bang · Vùng nông thôn', body: 'Trợ cấp và khoản vay cho chủ nhà thu nhập rất thấp ở vùng nông thôn. Trợ cấp giới hạn cho người từ 62 tuổi trở lên không thể trả khoản vay.', cta: 'Đăng ký qua USDA', meta2: 'Chỉ vùng nông thôn Illinois' },
      { name: 'Chicago HomeMod Program', amount: 'Lên đến $10,000', meta: 'Chicago · Khuyết tật', body: 'Sửa đổi tiếp cận cho cư dân Chicago khuyết tật. Bao gồm đường dốc, thang nâng, thanh vịn, phòng tắm tiếp cận, và mở rộng cửa.', cta: 'Đăng ký qua MOPD', meta2: 'Chỉ cư dân Chicago' },
    ],
    steps: [
      { title: 'Bắt đầu với HAFHR hoặc HRAP.', body: 'Chúng bao gồm nhiều loại sửa chữa nhất và số tiền lớn nhất, nên nhiều chủ nhà nộp đơn cho các chương trình này trước.' },
      { title: 'Đăng ký nhiều chương trình cùng lúc.', body: 'Trong nhiều trường hợp các chương trình có thể kết hợp. Đăng ký càng sớm, cơ hội càng cao trước khi hết quỹ trong năm.' },
      { title: 'Lấy báo giá bằng văn bản.', body: 'Hầu hết các chương trình yêu cầu ít nhất một báo giá của nhà thầu. Chọn nhà thầu có giấy phép và giữ tất cả giấy tờ.' },
      { title: 'Ghi lại nhu cầu.', body: 'Chụp ảnh vấn đề trước khi bất kỳ công việc nào bắt đầu. Lưu mọi báo cáo thanh tra hoặc thư từ công ty tiện ích của bạn.' },
      { title: 'Nếu bạn từ 60 tuổi trở lên, hãy hỏi về các chương trình cho người cao tuổi trước.', body: 'Các chương trình như SARFS và trợ cấp Section 504 dễ đủ điều kiện hơn nếu bạn là chủ nhà cao tuổi.' },
    ],
    referral: {
      sticker: 'Bắt đầu ở đây', title: 'Chicagoland Habitat for Humanity',
      orgName: 'Đơn vị quản lý chương trình HAFHR', orgSub: 'Hỗ trợ đơn đăng ký Quỹ Hỗ trợ Chủ nhà IHDA',
      orgDesc: 'Habitat for Humanity là đơn vị quản lý chính thức của HAFHR ở khu vực Chicago. Họ giúp bạn hoàn thành đơn, làm việc với nhà thầu, và đảm bảo việc sửa chữa của bạn đạt tiêu chuẩn chương trình.',
      websiteLabel: 'Trang web', website: 'chicagolandhabitat.org', hoursLabel: 'Giờ', hours: 'Thứ 2 to Thứ 6, 9 to 5',
      bringLabel: 'Mang theo những thứ này', bring: ['Giấy chủ quyền nhà', 'Hóa đơn thuế tài sản', 'Giấy tờ tùy thân có ảnh', 'Bằng chứng thu nhập', 'Ảnh các chỗ cần sửa'],
      startBtn: 'Bắt đầu đơn đăng ký →', otherBtn: 'Tìm chương trình khác',
    },
  },
}

export default function Repairs() {
  const { language } = useLanguage()
  const c = CONTENT[language] ?? CONTENT.en

  return (
    <TopicPage
      parentLabel={c.parentLabel}
      eyebrow={c.eyebrow}
      title={c.title}
      sub={c.sub}
      iconName="wrench"
      accent="var(--repairs)"
      quickNav={c.quickNav}
      summary={<>{c.summary}</>}
      faqs={c.faqs}
      programs={c.programs}
      steps={c.steps}
      referral={<ReferralCard r={c.referral} />}
    />
  )
}

function ReferralCard({ r }: { r: Referral }) {
  return (
    <aside className="referral" aria-label="Featured referral">
      <div className="referral-sticker" aria-hidden="true">{r.sticker}</div>
      <h3 className="serif referral-title">{r.title}</h3>
      <div className="referral-org">
        <div className="org-head">
          <div className="org-badge" aria-hidden="true">HB</div>
          <div>
            <p className="serif org-name">{r.orgName}</p>
            <p className="org-sub">{r.orgSub}</p>
          </div>
        </div>
        <p className="org-desc">{r.orgDesc}</p>
      </div>
      <div className="org-stats">
        <div className="stat"><p className="stat-label">{r.websiteLabel}</p><p className="stat-val">{r.website}</p></div>
        <div className="stat"><p className="stat-label">{r.hoursLabel}</p><p className="stat-val">{r.hours}</p></div>
      </div>
      <p className="bring-label">{r.bringLabel}</p>
      <ul className="bring-list">
        {r.bring.map((item, i) => <li key={i} className="bring-chip">{item}</li>)}
      </ul>
      <div className="referral-buttons">
        <a href="#" className="btn btn-clover external" target="_blank" rel="noopener" style={{ flex: 1, justifyContent: 'center' }}>
          {r.startBtn}
        </a>
        <button className="btn btn-outline">{r.otherBtn}</button>
      </div>
    </aside>
  )
}
