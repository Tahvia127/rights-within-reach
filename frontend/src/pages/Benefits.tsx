import { TopicPage } from '../components/TopicPage'
import { useLanguage, Language } from '../lib/translations'

// Per-language content for the Public Benefits topic page. English is the source
// of truth; es/zh/tl/vi are machine-drafted and PENDING NATIVE-SPEAKER REVIEW.
// Program names, statute citations, dollar amounts, and percentages stay verbatim.

interface FAQ { q: string; a: string; source: string }
interface Program { name: string; amount: string; meta: string; body: string; cta: string; meta2: string }
interface Step { title: string; body: string }
interface Referral {
  sticker: string; title: string; orgName: string; orgSub: string; orgDesc: string
  phoneLabel: string; phone: string; hoursLabel: string; hours: string
  bringLabel: string; bring: string[]; callBtn: string; otherBtn: string
}
interface TopicContent {
  parentLabel: string; eyebrow: string; title: string; sub: string
  quickNav: { id: string; label: string }[]
  summary: string; faqs: FAQ[]; programs: Program[]; steps: Step[]; referral: Referral
}

const CONTENT: Record<Language, TopicContent> = {
  en: {
    parentLabel: 'Public Benefits',
    eyebrow: 'Public benefits',
    title: 'SNAP, Medicaid, and other support.',
    sub: 'Eligibility, how to apply, and what to do if you have been denied or your benefits were cut off.',
    quickNav: [
      { id: 'summary', label: 'Summary' },
      { id: 'questions', label: 'Common questions' },
      { id: 'programs', label: 'Programs' },
      { id: 'action', label: 'What to do' },
      { id: 'help', label: 'Get help' },
    ],
    summary: "Public benefits like SNAP (food), Medicaid (health care), All Kids (children's coverage), and energy assistance help millions of Illinois residents make ends meet. Eligibility rules can be complicated, but the rules themselves are public and rooted in the Illinois Public Aid Code and federal regulations. If you are denied or cut off, you have the right to appeal.",
    faqs: [
      { q: 'Who qualifies for SNAP in Illinois?', a: 'In Illinois, most households with gross monthly income below 200% of the federal poverty level qualify. For a household of 1, that is about $2,510 per month in 2025. Households with elderly or disabled members have higher limits. Households on TANF or SSI are automatically eligible.', source: 'Illinois Department of Human Services, 89 Ill. Adm. Code 121' },
      { q: 'Can immigrants apply for Medicaid in Illinois?', a: 'Most lawful permanent residents qualify after 5 years. Children and pregnant people qualify regardless of immigration status under All Kids and Moms & Babies. Emergency Medicaid covers life-threatening emergencies for everyone regardless of status.', source: 'Illinois Public Aid Code, 305 ILCS 5' },
      { q: 'How do I apply for All Kids?', a: 'You can apply online at ABE.illinois.gov, by phone, in person at a Family Community Resource Center, or by mail. All Kids covers all children in Illinois regardless of immigration status, with low or no monthly premiums based on family income.', source: 'Illinois All Kids Program' },
      { q: 'My SNAP benefits were cut off. Can I appeal?', a: 'Yes. You have 90 days from the date of the notice to request an appeal hearing. If you appeal within 10 days, your benefits continue during the appeal. You have a right to free legal help at the hearing.', source: 'IDHS Appeal Rights, 89 Ill. Adm. Code 14' },
    ],
    programs: [
      { name: 'SNAP — Supplemental Nutrition Assistance Program', amount: 'Monthly', meta: 'Federal/state · Income-based', body: 'Provides a monthly benefit on an EBT card for groceries. Benefit amount depends on household size and income. You can apply online at ABE.illinois.gov.', cta: 'Apply for SNAP', meta2: 'Up to 200% of poverty level' },
      { name: 'Medicaid for Adults', amount: 'Free coverage', meta: 'Federal/state · Income-based', body: 'Health insurance for adults up to 138% of federal poverty level. Covers doctor visits, prescriptions, hospital care, mental health, and more. No monthly premium for most enrollees.', cta: 'Apply for Medicaid', meta2: 'Up to 138% of poverty level' },
      { name: 'All Kids', amount: 'Low premium', meta: 'State of Illinois · Children only', body: 'Health coverage for all children in Illinois regardless of immigration status. Premiums range from $0 to $80 per month per child based on income. Covers doctor visits, dental, vision, prescriptions, and more.', cta: 'Apply for All Kids', meta2: 'All Illinois children' },
      { name: 'TANF — Temporary Assistance for Needy Families', amount: 'Monthly cash', meta: 'Federal/state · Families with children', body: 'Cash assistance for low-income families with children. Comes with work requirements and time limits. Often combined with SNAP and Medicaid.', cta: 'Apply for TANF', meta2: 'Lifetime 60-month limit' },
      { name: 'WIC — Women, Infants, and Children', amount: 'Food benefits', meta: 'Federal · Pregnant + young children', body: 'Nutrition support for pregnant women, new mothers, and children up to age 5. Available regardless of immigration status. Income limit up to 185% of poverty level.', cta: 'Apply for WIC', meta2: 'Birth to age 5' },
    ],
    steps: [
      { title: 'Apply for everything at once.', body: 'ABE.illinois.gov lets you apply for SNAP, Medicaid, All Kids, TANF, and other benefits in a single application. There is no penalty for applying.' },
      { title: 'Keep your case worker informed.', body: 'If your address, income, or family changes, report it within 10 days. Failure to report can lead to overpayment claims later.' },
      { title: 'Save every letter from IDHS.', body: 'Notices have deadlines and appeal rights printed on them. Missing a 10-day window can mean losing benefits during an appeal.' },
      { title: 'Appeal denials immediately.', body: 'If you are denied, appeal within 10 days to keep your benefits running during the appeal. You have 90 days total, but the 10-day window protects current benefits.' },
      { title: 'Get free help with the application.', body: 'Community organizations and federally qualified health centers offer free help with benefits applications. You do not have to navigate ABE alone.' },
    ],
    referral: {
      sticker: '★ Start here', title: 'Legal Aid Chicago — Public Benefits Practice',
      orgName: 'Legal Aid Chicago', orgSub: 'Public benefits, appeals, and reinstatement',
      orgDesc: 'Legal Aid Chicago helps Illinois residents who have been denied or cut off from SNAP, Medicaid, TANF, or other benefits. They represent clients at appeal hearings and help with the application process for free.',
      phoneLabel: 'Phone', phone: '312-341-1070', hoursLabel: 'Hours', hours: 'Mon–Fri, 9–5',
      bringLabel: 'Bring these with you', bring: ['Denial letter', 'Photo ID', 'Proof of income', 'Social Security cards', 'Application copy'],
      callBtn: 'Call Legal Aid Chicago →', otherBtn: 'Find another org',
    },
  },

  es: {
    parentLabel: 'Beneficios públicos',
    eyebrow: 'Beneficios públicos',
    title: 'SNAP, Medicaid y otros apoyos.',
    sub: 'Elegibilidad, cómo solicitar, y qué hacer si te negaron o te cortaron los beneficios.',
    quickNav: [
      { id: 'summary', label: 'Resumen' },
      { id: 'questions', label: 'Preguntas comunes' },
      { id: 'programs', label: 'Programas' },
      { id: 'action', label: 'Qué hacer' },
      { id: 'help', label: 'Busca ayuda' },
    ],
    summary: 'Los beneficios públicos como SNAP (comida), Medicaid (atención médica), All Kids (cobertura para niños) y la ayuda de energía ayudan a millones de residentes de Illinois a llegar a fin de mes. Las reglas de elegibilidad pueden ser complicadas, pero las reglas mismas son públicas y se basan en el Código de Ayuda Pública de Illinois y las regulaciones federales. Si te niegan o te cortan los beneficios, tienes derecho a apelar.',
    faqs: [
      { q: '¿Quién califica para SNAP en Illinois?', a: 'En Illinois, la mayoría de los hogares con ingreso mensual bruto por debajo del 200% del nivel federal de pobreza califican. Para un hogar de 1 persona, eso es alrededor de $2,510 por mes en 2025. Los hogares con personas mayores o con discapacidad tienen límites más altos. Los hogares con TANF o SSI son automáticamente elegibles.', source: 'Illinois Department of Human Services, 89 Ill. Adm. Code 121' },
      { q: '¿Los inmigrantes pueden solicitar Medicaid en Illinois?', a: 'La mayoría de los residentes permanentes legales califican después de 5 años. Los niños y las personas embarazadas califican sin importar su estatus migratorio bajo All Kids y Moms & Babies. El Medicaid de Emergencia cubre emergencias que amenazan la vida para todos, sin importar el estatus.', source: 'Illinois Public Aid Code, 305 ILCS 5' },
      { q: '¿Cómo solicito All Kids?', a: 'Puedes solicitar en línea en ABE.illinois.gov, por teléfono, en persona en un Family Community Resource Center, o por correo. All Kids cubre a todos los niños en Illinois sin importar su estatus migratorio, con primas mensuales bajas o sin costo según el ingreso familiar.', source: 'Illinois All Kids Program' },
      { q: 'Me cortaron los beneficios de SNAP. ¿Puedo apelar?', a: 'Sí. Tienes 90 días desde la fecha del aviso para pedir una audiencia de apelación. Si apelas dentro de 10 días, tus beneficios continúan durante la apelación. Tienes derecho a ayuda legal gratis en la audiencia.', source: 'IDHS Appeal Rights, 89 Ill. Adm. Code 14' },
    ],
    programs: [
      { name: 'SNAP — Supplemental Nutrition Assistance Program', amount: 'Mensual', meta: 'Federal/estatal · Según ingresos', body: 'Provee un beneficio mensual en una tarjeta EBT para comestibles. El monto depende del tamaño del hogar y el ingreso. Puedes solicitar en línea en ABE.illinois.gov.', cta: 'Solicitar SNAP', meta2: 'Hasta 200% del nivel de pobreza' },
      { name: 'Medicaid for Adults', amount: 'Cobertura gratis', meta: 'Federal/estatal · Según ingresos', body: 'Seguro médico para adultos hasta el 138% del nivel federal de pobreza. Cubre consultas médicas, recetas, atención hospitalaria, salud mental y más. Sin prima mensual para la mayoría.', cta: 'Solicitar Medicaid', meta2: 'Hasta 138% del nivel de pobreza' },
      { name: 'All Kids', amount: 'Prima baja', meta: 'Estado de Illinois · Solo niños', body: 'Cobertura de salud para todos los niños en Illinois sin importar su estatus migratorio. Las primas van de $0 a $80 por mes por niño según el ingreso. Cubre consultas, dental, visión, recetas y más.', cta: 'Solicitar All Kids', meta2: 'Todos los niños de Illinois' },
      { name: 'TANF — Temporary Assistance for Needy Families', amount: 'Efectivo mensual', meta: 'Federal/estatal · Familias con hijos', body: 'Ayuda en efectivo para familias de bajos ingresos con hijos. Incluye requisitos de trabajo y límites de tiempo. A menudo se combina con SNAP y Medicaid.', cta: 'Solicitar TANF', meta2: 'Límite de por vida de 60 meses' },
      { name: 'WIC — Women, Infants, and Children', amount: 'Beneficios de comida', meta: 'Federal · Embarazadas + niños pequeños', body: 'Apoyo nutricional para mujeres embarazadas, nuevas madres y niños hasta los 5 años. Disponible sin importar el estatus migratorio. Límite de ingreso hasta 185% del nivel de pobreza.', cta: 'Solicitar WIC', meta2: 'Del nacimiento a los 5 años' },
    ],
    steps: [
      { title: 'Solicita todo a la vez.', body: 'ABE.illinois.gov te permite solicitar SNAP, Medicaid, All Kids, TANF y otros beneficios en una sola solicitud. No hay penalización por solicitar.' },
      { title: 'Mantén informado a tu trabajador de caso.', body: 'Si tu dirección, ingreso o familia cambian, repórtalo dentro de 10 días. No reportar puede llevar a reclamos de sobrepago más adelante.' },
      { title: 'Guarda cada carta de IDHS.', body: 'Los avisos tienen plazos y derechos de apelación impresos. Perder una ventana de 10 días puede significar perder beneficios durante una apelación.' },
      { title: 'Apela las negaciones de inmediato.', body: 'Si te niegan, apela dentro de 10 días para mantener tus beneficios durante la apelación. Tienes 90 días en total, pero la ventana de 10 días protege los beneficios actuales.' },
      { title: 'Consigue ayuda gratis con la solicitud.', body: 'Organizaciones comunitarias y centros de salud calificados federalmente ofrecen ayuda gratis con las solicitudes de beneficios. No tienes que navegar ABE solo.' },
    ],
    referral: {
      sticker: '★ Empieza aquí', title: 'Legal Aid Chicago — Public Benefits Practice',
      orgName: 'Legal Aid Chicago', orgSub: 'Beneficios públicos, apelaciones y reinstalación',
      orgDesc: 'Legal Aid Chicago ayuda a los residentes de Illinois a quienes les negaron o cortaron SNAP, Medicaid, TANF u otros beneficios. Representan a clientes en audiencias de apelación y ayudan con el proceso de solicitud gratis.',
      phoneLabel: 'Teléfono', phone: '312-341-1070', hoursLabel: 'Horario', hours: 'Lun–Vie, 9–5',
      bringLabel: 'Lleva esto contigo', bring: ['Carta de negación', 'Identificación con foto', 'Comprobante de ingresos', 'Tarjetas de Seguro Social', 'Copia de la solicitud'],
      callBtn: 'Llamar a Legal Aid Chicago →', otherBtn: 'Buscar otra organización',
    },
  },

  zh: {
    parentLabel: '公共福利',
    eyebrow: '公共福利',
    title: 'SNAP、Medicaid 和其他支持。',
    sub: '资格、如何申请，以及如果被拒或福利被切断该怎么办。',
    quickNav: [
      { id: 'summary', label: '摘要' },
      { id: 'questions', label: '常见问题' },
      { id: 'programs', label: '项目' },
      { id: 'action', label: '该做什么' },
      { id: 'help', label: '获取帮助' },
    ],
    summary: 'SNAP（食品）、Medicaid（医疗）、All Kids（儿童保险）和能源援助等公共福利帮助数百万伊利诺伊州居民维持生计。资格规则可能很复杂，但这些规则本身是公开的，依据《伊利诺伊州公共援助法》和联邦法规。如果您被拒或被切断，您有权上诉。',
    faqs: [
      { q: '在伊利诺伊州，谁有资格领取 SNAP？', a: '在伊利诺伊州，大多数月总收入低于联邦贫困线200%的家庭符合资格。对于1人家庭，2025年约为每月 $2,510。有老年或残障成员的家庭限额更高。领取 TANF 或 SSI 的家庭自动符合资格。', source: 'Illinois Department of Human Services, 89 Ill. Adm. Code 121' },
      { q: '移民可以在伊利诺伊州申请 Medicaid 吗？', a: '大多数合法永久居民在5年后符合资格。根据 All Kids 和 Moms & Babies，儿童和孕妇无论移民身份如何都符合资格。紧急 Medicaid 为所有人覆盖危及生命的紧急情况，不论身份。', source: 'Illinois Public Aid Code, 305 ILCS 5' },
      { q: '我如何申请 All Kids？', a: '您可以在 ABE.illinois.gov 在线申请、通过电话、亲自前往 Family Community Resource Center，或邮寄申请。All Kids 覆盖伊利诺伊州所有儿童，不论移民身份，根据家庭收入收取低额或免费的月保费。', source: 'Illinois All Kids Program' },
      { q: '我的 SNAP 福利被切断了。我能上诉吗？', a: '能。您有从通知日期起90天的时间申请上诉听证会。如果您在10天内上诉，您的福利在上诉期间继续。您有权在听证会上获得免费法律帮助。', source: 'IDHS Appeal Rights, 89 Ill. Adm. Code 14' },
    ],
    programs: [
      { name: 'SNAP — Supplemental Nutrition Assistance Program', amount: '每月', meta: '联邦/州 · 按收入', body: '在 EBT 卡上提供每月福利用于购买食品杂货。福利金额取决于家庭人数和收入。您可以在 ABE.illinois.gov 在线申请。', cta: '申请 SNAP', meta2: '最高贫困线200%' },
      { name: 'Medicaid for Adults', amount: '免费保险', meta: '联邦/州 · 按收入', body: '为收入达联邦贫困线138%的成年人提供医疗保险。涵盖看医生、处方、住院、心理健康等。大多数参保人无月保费。', cta: '申请 Medicaid', meta2: '最高贫困线138%' },
      { name: 'All Kids', amount: '低保费', meta: '伊利诺伊州 · 仅儿童', body: '为伊利诺伊州所有儿童提供医疗保险，不论移民身份。保费根据收入从每名儿童每月 $0 到 $80 不等。涵盖看医生、牙科、视力、处方等。', cta: '申请 All Kids', meta2: '伊利诺伊州所有儿童' },
      { name: 'TANF — Temporary Assistance for Needy Families', amount: '每月现金', meta: '联邦/州 · 有子女家庭', body: '为有子女的低收入家庭提供现金援助。附带工作要求和时间限制。常与 SNAP 和 Medicaid 结合。', cta: '申请 TANF', meta2: '终身60个月限制' },
      { name: 'WIC — Women, Infants, and Children', amount: '食品福利', meta: '联邦 · 孕妇+幼儿', body: '为孕妇、新妈妈和5岁以下儿童提供营养支持。不论移民身份均可申请。收入限额最高贫困线185%。', cta: '申请 WIC', meta2: '出生至5岁' },
    ],
    steps: [
      { title: '一次申请所有项目。', body: 'ABE.illinois.gov 让您在一份申请中申请 SNAP、Medicaid、All Kids、TANF 和其他福利。申请没有惩罚。' },
      { title: '让您的个案工作者了解情况。', body: '如果您的地址、收入或家庭发生变化，请在10天内报告。不报告可能导致日后的超额支付索赔。' },
      { title: '保存 IDHS 的每一封信。', body: '通知上印有截止日期和上诉权利。错过10天的窗口可能意味着在上诉期间失去福利。' },
      { title: '立即对拒绝提出上诉。', body: '如果您被拒，请在10天内上诉，以在上诉期间保持福利。您总共有90天，但10天的窗口保护当前福利。' },
      { title: '获取免费的申请帮助。', body: '社区组织和联邦合格健康中心提供免费的福利申请帮助。您不必独自应对 ABE。' },
    ],
    referral: {
      sticker: '★ 从这里开始', title: 'Legal Aid Chicago — Public Benefits Practice',
      orgName: 'Legal Aid Chicago', orgSub: '公共福利、上诉和恢复',
      orgDesc: 'Legal Aid Chicago 帮助被拒或被切断 SNAP、Medicaid、TANF 或其他福利的伊利诺伊州居民。他们在上诉听证会上代表客户，并免费协助申请流程。',
      phoneLabel: '电话', phone: '312-341-1070', hoursLabel: '时间', hours: '周一至周五, 9–5',
      bringLabel: '请带上这些', bring: ['拒绝信', '带照片的身份证件', '收入证明', '社会安全卡', '申请副本'],
      callBtn: '致电 Legal Aid Chicago →', otherBtn: '查找其他机构',
    },
  },

  tl: {
    parentLabel: 'Pampublikong benepisyo',
    eyebrow: 'Pampublikong benepisyo',
    title: 'SNAP, Medicaid, at iba pang tulong.',
    sub: 'Pagiging karapat-dapat, paano mag-apply, at ang gagawin kung tinanggihan ka o pinutol ang iyong benepisyo.',
    quickNav: [
      { id: 'summary', label: 'Buod' },
      { id: 'questions', label: 'Karaniwang tanong' },
      { id: 'programs', label: 'Mga programa' },
      { id: 'action', label: 'Ano ang gagawin' },
      { id: 'help', label: 'Humingi ng tulong' },
    ],
    summary: 'Ang mga pampublikong benepisyo tulad ng SNAP (pagkain), Medicaid (pangangalaga sa kalusugan), All Kids (saklaw para sa bata), at tulong sa enerhiya ay tumutulong sa milyun-milyong residente ng Illinois na makaraos. Maaaring kumplikado ang mga panuntunan sa pagiging karapat-dapat, ngunit ang mga panuntunan mismo ay pampubliko at nakabatay sa Illinois Public Aid Code at mga pederal na regulasyon. Kung tinanggihan ka o pinutol, may karapatan kang mag-apela.',
    faqs: [
      { q: 'Sino ang kwalipikado sa SNAP sa Illinois?', a: 'Sa Illinois, karamihan ng mga sambahayang may gross na buwanang kita na mas mababa sa 200% ng pederal na antas ng kahirapan ay kwalipikado. Para sa sambahayan ng 1, iyon ay halos $2,510 kada buwan sa 2025. Ang mga sambahayang may matatanda o may kapansanan ay may mas mataas na limitasyon. Ang mga sambahayang nasa TANF o SSI ay awtomatikong kwalipikado.', source: 'Illinois Department of Human Services, 89 Ill. Adm. Code 121' },
      { q: 'Maaari bang mag-apply ang mga imigrante ng Medicaid sa Illinois?', a: 'Karamihan ng mga legal na permanenteng residente ay kwalipikado pagkatapos ng 5 taon. Ang mga bata at buntis ay kwalipikado anuman ang katayuan sa imigrasyon sa ilalim ng All Kids at Moms & Babies. Sinasaklaw ng Emergency Medicaid ang mga emerhensyang nakamamatay para sa lahat anuman ang katayuan.', source: 'Illinois Public Aid Code, 305 ILCS 5' },
      { q: 'Paano ako mag-a-apply sa All Kids?', a: 'Maaari kang mag-apply online sa ABE.illinois.gov, sa telepono, nang personal sa isang Family Community Resource Center, o sa pamamagitan ng koreo. Sinasaklaw ng All Kids ang lahat ng bata sa Illinois anuman ang katayuan sa imigrasyon, na may mababa o walang buwanang premium batay sa kita ng pamilya.', source: 'Illinois All Kids Program' },
      { q: 'Pinutol ang aking benepisyo sa SNAP. Maaari ba akong mag-apela?', a: 'Oo. May 90 araw ka mula sa petsa ng abiso para humiling ng pagdinig ng apela. Kung mag-apela ka sa loob ng 10 araw, magpapatuloy ang iyong benepisyo habang nakabinbin ang apela. May karapatan ka sa libreng tulong legal sa pagdinig.', source: 'IDHS Appeal Rights, 89 Ill. Adm. Code 14' },
    ],
    programs: [
      { name: 'SNAP — Supplemental Nutrition Assistance Program', amount: 'Buwanan', meta: 'Pederal/estado · Batay sa kita', body: 'Nagbibigay ng buwanang benepisyo sa EBT card para sa grocery. Ang halaga ng benepisyo ay nakadepende sa laki ng sambahayan at kita. Maaari kang mag-apply online sa ABE.illinois.gov.', cta: 'Mag-apply sa SNAP', meta2: 'Hanggang 200% ng antas ng kahirapan' },
      { name: 'Medicaid for Adults', amount: 'Libreng saklaw', meta: 'Pederal/estado · Batay sa kita', body: 'Segurong pangkalusugan para sa mga adultong hanggang 138% ng pederal na antas ng kahirapan. Saklaw ang pagpunta sa doktor, reseta, ospital, kalusugang pangkaisipan, at iba pa. Walang buwanang premium para sa karamihan.', cta: 'Mag-apply sa Medicaid', meta2: 'Hanggang 138% ng antas ng kahirapan' },
      { name: 'All Kids', amount: 'Mababang premium', meta: 'Estado ng Illinois · Mga bata lang', body: 'Saklaw na pangkalusugan para sa lahat ng bata sa Illinois anuman ang katayuan sa imigrasyon. Ang premium ay mula $0 hanggang $80 kada buwan kada bata batay sa kita. Saklaw ang doktor, ngipin, mata, reseta, at iba pa.', cta: 'Mag-apply sa All Kids', meta2: 'Lahat ng bata sa Illinois' },
      { name: 'TANF — Temporary Assistance for Needy Families', amount: 'Buwanang cash', meta: 'Pederal/estado · Pamilyang may anak', body: 'Tulong na cash para sa mga pamilyang mababa ang kita na may anak. May kasamang kinakailangan sa trabaho at limitasyon sa oras. Madalas pinagsasama sa SNAP at Medicaid.', cta: 'Mag-apply sa TANF', meta2: 'Habambuhay na limitasyong 60 buwan' },
      { name: 'WIC — Women, Infants, and Children', amount: 'Benepisyo sa pagkain', meta: 'Pederal · Buntis + maliliit na bata', body: 'Suporta sa nutrisyon para sa mga buntis, bagong ina, at bata hanggang edad 5. Available anuman ang katayuan sa imigrasyon. Limitasyon sa kita hanggang 185% ng antas ng kahirapan.', cta: 'Mag-apply sa WIC', meta2: 'Kapanganakan hanggang edad 5' },
    ],
    steps: [
      { title: 'Mag-apply sa lahat nang sabay.', body: 'Hinahayaan ka ng ABE.illinois.gov na mag-apply sa SNAP, Medicaid, All Kids, TANF, at iba pang benepisyo sa isang aplikasyon. Walang parusa sa pag-apply.' },
      { title: 'Panatilihing nakaalam ang iyong case worker.', body: 'Kung nagbago ang iyong address, kita, o pamilya, iulat ito sa loob ng 10 araw. Ang hindi pag-uulat ay maaaring humantong sa mga claim ng overpayment sa hinaharap.' },
      { title: 'I-save ang bawat liham mula sa IDHS.', body: 'May nakaprint na mga deadline at karapatan sa apela ang mga abiso. Ang pagkaligta sa 10-araw na window ay maaaring mangahulugan ng pagkawala ng benepisyo habang nag-aapela.' },
      { title: 'Iapela agad ang mga pagtanggi.', body: 'Kung tinanggihan ka, mag-apela sa loob ng 10 araw para panatilihing tumatakbo ang iyong benepisyo habang nag-aapela. May 90 araw ka sa kabuuan, ngunit ang 10-araw na window ang nagpoprotekta sa kasalukuyang benepisyo.' },
      { title: 'Humingi ng libreng tulong sa aplikasyon.', body: 'Ang mga organisasyon sa komunidad at mga federally qualified health center ay nag-aalok ng libreng tulong sa mga aplikasyon ng benepisyo. Hindi mo kailangang harapin ang ABE nang mag-isa.' },
    ],
    referral: {
      sticker: '★ Magsimula dito', title: 'Legal Aid Chicago — Public Benefits Practice',
      orgName: 'Legal Aid Chicago', orgSub: 'Pampublikong benepisyo, apela, at pagbabalik',
      orgDesc: 'Tinutulungan ng Legal Aid Chicago ang mga residente ng Illinois na tinanggihan o pinutol sa SNAP, Medicaid, TANF, o iba pang benepisyo. Kinakatawan nila ang mga kliyente sa pagdinig ng apela at tumutulong sa proseso ng aplikasyon nang libre.',
      phoneLabel: 'Telepono', phone: '312-341-1070', hoursLabel: 'Oras', hours: 'Lun–Biy, 9–5',
      bringLabel: 'Dalhin ang mga ito', bring: ['Liham ng pagtanggi', 'ID na may litrato', 'Patunay ng kita', 'Mga Social Security card', 'Kopya ng aplikasyon'],
      callBtn: 'Tawagan ang Legal Aid Chicago →', otherBtn: 'Maghanap ng ibang organisasyon',
    },
  },

  vi: {
    parentLabel: 'Phúc lợi công',
    eyebrow: 'Phúc lợi công',
    title: 'SNAP, Medicaid, và các hỗ trợ khác.',
    sub: 'Điều kiện, cách đăng ký, và việc cần làm nếu bạn bị từ chối hoặc phúc lợi bị cắt.',
    quickNav: [
      { id: 'summary', label: 'Tóm tắt' },
      { id: 'questions', label: 'Câu hỏi thường gặp' },
      { id: 'programs', label: 'Chương trình' },
      { id: 'action', label: 'Việc cần làm' },
      { id: 'help', label: 'Nhận trợ giúp' },
    ],
    summary: 'Các phúc lợi công như SNAP (thực phẩm), Medicaid (chăm sóc sức khỏe), All Kids (bảo hiểm cho trẻ em), và hỗ trợ năng lượng giúp hàng triệu cư dân Illinois trang trải cuộc sống. Quy tắc điều kiện có thể phức tạp, nhưng bản thân các quy tắc là công khai và dựa trên Bộ luật Trợ giúp Công Illinois và quy định liên bang. Nếu bạn bị từ chối hoặc bị cắt, bạn có quyền kháng cáo.',
    faqs: [
      { q: 'Ai đủ điều kiện nhận SNAP ở Illinois?', a: 'Tại Illinois, hầu hết các hộ có tổng thu nhập hằng tháng dưới 200% mức nghèo liên bang đều đủ điều kiện. Đối với hộ 1 người, đó là khoảng $2,510 mỗi tháng vào năm 2025. Các hộ có thành viên cao tuổi hoặc khuyết tật có giới hạn cao hơn. Các hộ nhận TANF hoặc SSI tự động đủ điều kiện.', source: 'Illinois Department of Human Services, 89 Ill. Adm. Code 121' },
      { q: 'Người nhập cư có thể đăng ký Medicaid ở Illinois không?', a: 'Hầu hết thường trú nhân hợp pháp đủ điều kiện sau 5 năm. Trẻ em và người mang thai đủ điều kiện bất kể tình trạng nhập cư theo All Kids và Moms & Babies. Medicaid Khẩn cấp bao trả các trường hợp nguy hiểm tính mạng cho mọi người bất kể tình trạng.', source: 'Illinois Public Aid Code, 305 ILCS 5' },
      { q: 'Tôi đăng ký All Kids như thế nào?', a: 'Bạn có thể đăng ký trực tuyến tại ABE.illinois.gov, qua điện thoại, trực tiếp tại một Family Community Resource Center, hoặc qua thư. All Kids bao trả mọi trẻ em ở Illinois bất kể tình trạng nhập cư, với phí hằng tháng thấp hoặc miễn phí dựa trên thu nhập gia đình.', source: 'Illinois All Kids Program' },
      { q: 'Phúc lợi SNAP của tôi bị cắt. Tôi có thể kháng cáo không?', a: 'Có. Bạn có 90 ngày kể từ ngày thông báo để yêu cầu một buổi điều trần kháng cáo. Nếu bạn kháng cáo trong vòng 10 ngày, phúc lợi của bạn tiếp tục trong thời gian kháng cáo. Bạn có quyền được trợ giúp pháp lý miễn phí tại buổi điều trần.', source: 'IDHS Appeal Rights, 89 Ill. Adm. Code 14' },
    ],
    programs: [
      { name: 'SNAP — Supplemental Nutrition Assistance Program', amount: 'Hằng tháng', meta: 'Liên bang/bang · Theo thu nhập', body: 'Cung cấp phúc lợi hằng tháng trên thẻ EBT để mua thực phẩm. Số tiền tùy theo quy mô hộ và thu nhập. Bạn có thể đăng ký trực tuyến tại ABE.illinois.gov.', cta: 'Đăng ký SNAP', meta2: 'Lên đến 200% mức nghèo' },
      { name: 'Medicaid for Adults', amount: 'Bảo hiểm miễn phí', meta: 'Liên bang/bang · Theo thu nhập', body: 'Bảo hiểm y tế cho người lớn đến 138% mức nghèo liên bang. Bao gồm khám bác sĩ, thuốc theo toa, chăm sóc bệnh viện, sức khỏe tâm thần, và hơn thế. Hầu hết người tham gia không có phí hằng tháng.', cta: 'Đăng ký Medicaid', meta2: 'Lên đến 138% mức nghèo' },
      { name: 'All Kids', amount: 'Phí thấp', meta: 'Bang Illinois · Chỉ trẻ em', body: 'Bảo hiểm y tế cho mọi trẻ em ở Illinois bất kể tình trạng nhập cư. Phí từ $0 đến $80 mỗi tháng cho mỗi trẻ tùy theo thu nhập. Bao gồm khám bác sĩ, nha khoa, mắt, thuốc, và hơn thế.', cta: 'Đăng ký All Kids', meta2: 'Mọi trẻ em ở Illinois' },
      { name: 'TANF — Temporary Assistance for Needy Families', amount: 'Tiền mặt hằng tháng', meta: 'Liên bang/bang · Gia đình có con', body: 'Trợ cấp tiền mặt cho các gia đình thu nhập thấp có con. Đi kèm yêu cầu làm việc và giới hạn thời gian. Thường kết hợp với SNAP và Medicaid.', cta: 'Đăng ký TANF', meta2: 'Giới hạn trọn đời 60 tháng' },
      { name: 'WIC — Women, Infants, and Children', amount: 'Phúc lợi thực phẩm', meta: 'Liên bang · Mang thai + trẻ nhỏ', body: 'Hỗ trợ dinh dưỡng cho phụ nữ mang thai, bà mẹ mới sinh, và trẻ em đến 5 tuổi. Có sẵn bất kể tình trạng nhập cư. Giới hạn thu nhập đến 185% mức nghèo.', cta: 'Đăng ký WIC', meta2: 'Từ sơ sinh đến 5 tuổi' },
    ],
    steps: [
      { title: 'Đăng ký mọi thứ cùng lúc.', body: 'ABE.illinois.gov cho phép bạn đăng ký SNAP, Medicaid, All Kids, TANF, và các phúc lợi khác trong một đơn duy nhất. Không có hình phạt khi đăng ký.' },
      { title: 'Giữ cho nhân viên hồ sơ của bạn được cập nhật.', body: 'Nếu địa chỉ, thu nhập, hoặc gia đình của bạn thay đổi, hãy báo trong vòng 10 ngày. Không báo có thể dẫn đến khiếu nại trả thừa sau này.' },
      { title: 'Lưu mọi lá thư từ IDHS.', body: 'Các thông báo có in thời hạn và quyền kháng cáo. Bỏ lỡ cửa sổ 10 ngày có thể đồng nghĩa mất phúc lợi trong khi kháng cáo.' },
      { title: 'Kháng cáo việc từ chối ngay lập tức.', body: 'Nếu bị từ chối, hãy kháng cáo trong vòng 10 ngày để giữ phúc lợi chạy trong thời gian kháng cáo. Bạn có tổng cộng 90 ngày, nhưng cửa sổ 10 ngày bảo vệ phúc lợi hiện tại.' },
      { title: 'Nhận trợ giúp miễn phí với đơn đăng ký.', body: 'Các tổ chức cộng đồng và trung tâm y tế đủ điều kiện liên bang cung cấp trợ giúp miễn phí với đơn phúc lợi. Bạn không phải tự mình xử lý ABE.' },
    ],
    referral: {
      sticker: '★ Bắt đầu ở đây', title: 'Legal Aid Chicago — Public Benefits Practice',
      orgName: 'Legal Aid Chicago', orgSub: 'Phúc lợi công, kháng cáo, và khôi phục',
      orgDesc: 'Legal Aid Chicago giúp cư dân Illinois bị từ chối hoặc bị cắt SNAP, Medicaid, TANF, hoặc các phúc lợi khác. Họ đại diện cho khách hàng tại các buổi điều trần kháng cáo và giúp với quá trình đăng ký miễn phí.',
      phoneLabel: 'Điện thoại', phone: '312-341-1070', hoursLabel: 'Giờ', hours: 'Thứ 2–Thứ 6, 9–5',
      bringLabel: 'Mang theo những thứ này', bring: ['Thư từ chối', 'Giấy tờ tùy thân có ảnh', 'Bằng chứng thu nhập', 'Thẻ An sinh Xã hội', 'Bản sao đơn đăng ký'],
      callBtn: 'Gọi Legal Aid Chicago →', otherBtn: 'Tìm tổ chức khác',
    },
  },
}

export default function Benefits() {
  const { language } = useLanguage()
  const c = CONTENT[language] ?? CONTENT.en

  return (
    <TopicPage
      parentLabel={c.parentLabel}
      eyebrow={c.eyebrow}
      title={c.title}
      sub={c.sub}
      iconName="benefits"
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
  const tel = `tel:${r.phone.replace(/[^0-9]/g, '')}`
  return (
    <aside className="referral" aria-label="Featured referral">
      <div className="referral-sticker" aria-hidden="true">{r.sticker}</div>
      <h3 className="serif referral-title">{r.title}</h3>
      <div className="referral-org">
        <div className="org-head">
          <div className="org-badge" aria-hidden="true">LA</div>
          <div>
            <p className="serif org-name">{r.orgName}</p>
            <p className="org-sub">{r.orgSub}</p>
          </div>
        </div>
        <p className="org-desc">{r.orgDesc}</p>
      </div>
      <div className="org-stats">
        <div className="stat"><p className="stat-label">{r.phoneLabel}</p><p className="stat-val"><a href={tel}>{r.phone}</a></p></div>
        <div className="stat"><p className="stat-label">{r.hoursLabel}</p><p className="stat-val">{r.hours}</p></div>
      </div>
      <p className="bring-label">{r.bringLabel}</p>
      <ul className="bring-list">
        {r.bring.map((item, i) => <li key={i} className="bring-chip">{item}</li>)}
      </ul>
      <div className="referral-buttons">
        <a href={tel} className="btn btn-clover" style={{ flex: 1, justifyContent: 'center' }}>
          {r.callBtn}
        </a>
        <button className="btn btn-outline">{r.otherBtn}</button>
      </div>
    </aside>
  )
}
