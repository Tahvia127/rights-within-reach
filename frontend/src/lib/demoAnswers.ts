// demoAnswers.ts
// Showcase safety net: if the answer engine is unreachable or out of API credits,
// the chat falls back to these accurate, pre-written answers so a live demo still
// shows a real-looking, correctly-structured answer card. Content is real Illinois
// legal information with real sources and verified org contacts, it is not
// generated, just curated. Matched by keyword; localized to all 5 site languages.
//
// Translatable prose lives in CONTENT[lang]; org names, phone numbers, statute
// citations, and source titles stay as-is across languages (like the rest of the
// site). Non-English blocks are machine-drafted, pending native-speaker review;
// any missing language falls back to English.

import type { AskResponse, Source, Contact } from './api'
import type { Language } from './translations'

interface KP { label: string; text: string }
interface Content {
  answer: string
  key_points: KP[]
  next_steps: string[]
  contactSub: string
  contactWhy: string
  contactHow: string
  follow_ups: string[]
}
interface DemoMeta {
  id: string
  keywords: string[]
  subjects?: string[]
  topic: string
  confidence: string
  contact: { name: string; phone?: string; hours?: string; url?: string }
  sources: Source[]
}

const DISCLAIMER: Record<string, string> = {
  "en": "Rights Within Reach shares general legal information, not legal advice. It may not reflect the most recent changes to the law and may not fit your exact situation. For advice about your case, talk to a licensed attorney or a free legal-aid organization.",
  "es": "Rights Within Reach comparte información legal general, no asesoría legal. Es posible que no refleje los cambios más recientes en la ley y que no se ajuste a su situación exacta. Para recibir asesoría sobre su caso, hable con un abogado con licencia o con una organización de ayuda legal gratuita.",
  "zh": "Rights Within Reach 提供的是一般性法律信息，而不是法律建议。这些信息可能未反映法律的最新变化，也可能不适合您的具体情况。如需针对您案件的建议，请咨询有执照的律师或免费的法律援助机构。",
  "tl": "Ang Rights Within Reach ay nagbabahagi ng pangkalahatang impormasyong legal, hindi legal na payo. Maaaring hindi nito masasalamin ang pinakabagong pagbabago sa batas at maaaring hindi tugma sa iyong eksaktong sitwasyon. Para sa payo tungkol sa iyong kaso, kausapin ang isang lisensyadong abogado o isang libreng organisasyon ng legal-aid.",
  "vi": "Rights Within Reach chia sẻ thông tin pháp lý chung, không phải lời khuyên pháp lý. Thông tin này có thể không phản ánh những thay đổi mới nhất của luật và có thể không phù hợp với tình huống cụ thể của bạn. Để được tư vấn về trường hợp của bạn, hãy nói chuyện với một luật sư có giấy phép hoặc một tổ chức trợ giúp pháp lý miễn phí."
}

// ---- structural metadata (not translated) ----
const DEMO_META: DemoMeta[] = [
  {
    id: 'rentIncrease',
    keywords: ['rent increase', 'raise my rent', 'raise the rent', 'raising my rent', 'raising the rent', 'raising rent', 'rent go up', 'higher rent', 'increase rent', 'rent raised', 'landlord raise', 'notice before rais', 'much can my landlord charge', 'subir la renta', 'aumento de renta', 'suba la renta', 'aumento antes', '涨租', '房租', '租金', 'taasan ang upa', 'pagtaas ng upa', 'tăng tiền thuê', 'tăng giá thuê'],
    subjects: ['housing'],
    topic: 'housing',
    confidence: 'high',
    contact: { name: 'Cook County Legal Aid for Housing & Debt (CCLAHD)', phone: '855-956-5763', hours: 'Mon to Fri, 9 to 4:30' },
    sources: [
      { title: 'Chicago Fair Notice Ordinance', section: 'Notice of rent increase or non-renewal', topic: 'housing', url: 'https://www.chicago.gov/city/en/depts/doh/provdrs/renters.html' },
      { title: 'Illinois Rent Control Preemption Act', section: '50 ILCS 825', topic: 'housing' },
    ],
  },
  {
    id: 'eviction',
    keywords: ['evict', 'eviction', 'kicked out', 'notice to quit', 'move out notice', '5 day', 'five day', 'notice was late', 'notice late', 'late notice', 'notice came late', 'desalojo', 'desalojar', 'aviso llegó tarde', 'aviso tarde', '驱逐', '通知迟', '赶出', 'pagpapaalis', 'huli ang abiso', 'paalisin', 'trục xuất', 'thông báo bị trễ', 'đuổi'],
    subjects: ['housing'],
    topic: 'housing',
    confidence: 'high',
    contact: { name: 'Eviction Help Illinois', phone: '855-631-0811', hours: 'Mon to Fri' },
    sources: [
      { title: 'Illinois Forcible Entry and Detainer Act', section: '735 ILCS 5/9-201 to 9-321', topic: 'housing' },
      { title: 'Illinois Legal Aid Online', section: 'Eviction: an overview', topic: 'housing', url: 'https://www.illinoislegalaid.org/legal-information/eviction-overview' },
    ],
  },
  {
    id: 'deposit',
    keywords: ['deposit', 'security deposit', 'get my deposit', 'deposit back', 'depósito', 'depósito de seguridad', '押金', 'deposito', 'tiền đặt cọc', 'đặt cọc'],
    subjects: ['housing'],
    topic: 'housing',
    confidence: 'high',
    contact: { name: 'CARPLS Legal Aid Hotline', phone: '312-738-9200', hours: 'Mon to Fri, 9 to 4:30' },
    sources: [
      { title: 'Chicago Residential Landlord and Tenant Ordinance (RLTO)', section: '5-12-080, Security deposits', topic: 'housing', url: 'https://www.chicago.gov/city/en/depts/doh/provdrs/renters.html' },
      { title: 'Illinois Security Deposit Return Act', section: '765 ILCS 710', topic: 'housing' },
    ],
  },
  {
    id: 'snap',
    keywords: ['snap', 'food stamp', 'food stamps', 'food assistance', 'link card', 'apply for food', 'cupones de alimentos', 'ayuda de alimentos', '食品券', '食品援助', 'tem phiếu thực phẩm', 'tulong sa pagkain'],
    subjects: ['benefits'],
    topic: 'benefits',
    confidence: 'high',
    contact: { name: 'Greater Chicago Food Depository', phone: '773-247-3663', hours: 'Mon to Fri' },
    sources: [
      { title: 'Illinois Department of Human Services', section: 'SNAP (food assistance)', topic: 'benefits', url: 'https://www.dhs.state.il.us/page.aspx?item=30357' },
      { title: 'Application for Benefits Eligibility (ABE)', section: 'abe.illinois.gov', topic: 'benefits', url: 'https://abe.illinois.gov' },
    ],
  },
  {
    id: 'debt',
    keywords: ['debt', 'collector', 'collection', 'garnish', 'garnishment', 'i owe', 'sued for money', 'creditor', 'deuda', 'cobrador', 'embargo', '债', '讨债', '欠钱', 'utang', 'maniningil', 'nợ', 'đòi nợ', 'thu nợ'],
    subjects: ['money'],
    topic: 'money_debt',
    confidence: 'medium',
    contact: { name: 'CARPLS Legal Aid Hotline', phone: '312-738-9200', hours: 'Mon to Fri, 9 to 4:30' },
    sources: [
      { title: 'Fair Debt Collection Practices Act', section: '15 U.S.C. §1692', topic: 'money_debt', url: 'https://www.consumerfinance.gov/consumer-tools/debt-collection/' },
      { title: 'Illinois Wage Deduction / Garnishment Law', section: '735 ILCS 5/12-801', topic: 'money_debt' },
    ],
  },
  {
    id: 'repair',
    keywords: ['repair', 'furnace', 'roof', 'fix my home', 'home repair', 'grant to fix', 'porch', 'techo', 'reparación', 'arreglar mi', 'reparar', 'caldera', '屋顶', '维修', '修屋', 'bubong', 'pagkukumpuni', 'ayusin ang bahay', 'mái nhà', 'sửa nhà', 'sửa chữa'],
    subjects: ['repairs'],
    topic: 'housing_repair',
    confidence: 'medium',
    contact: { name: 'Illinois Housing Development Authority (IHDA)', phone: '312-836-5200', hours: 'Mon to Fri', url: 'ihda.org' },
    sources: [
      { title: 'Illinois Housing Development Authority', section: 'Home repair & accessibility programs', topic: 'housing_repair', url: 'https://www.ihda.org' },
      { title: 'City of Chicago, Department of Housing', section: 'Home repair programs', topic: 'housing_repair', url: 'https://www.chicago.gov/city/en/depts/doh.html' },
    ],
  },
]

const GENERIC_META: DemoMeta = {
  id: 'generic',
  keywords: [],
  topic: 'resources',
  confidence: 'medium',
  contact: { name: '211 Metro Chicago (United Way)', phone: '2-1-1', hours: '24/7 · free' },
  sources: [
    { title: 'Illinois Legal Aid Online', section: 'Get legal help', topic: 'resources', url: 'https://www.illinoislegalaid.org' },
  ],
}

// ---- translatable content, keyed by demo id, per language ----
const EN: Record<string, Content> = {
  rentIncrease: {
    answer: 'Illinois has no cap on how much rent can go up, state law bans rent control. But your landlord must give you written notice before an increase starts, and cannot raise the rent in the middle of a fixed-term lease unless the lease allows it. In the City of Chicago, the Fair Notice Ordinance sets how much warning you get based on how long you have lived there: 30 days if under 6 months, 60 days if 6 months to 3 years, and 120 days if more than 3 years.',
    key_points: [
      { label: 'No rent control', text: 'Illinois law prohibits rent control, so there is no legal maximum on the amount.' },
      { label: 'Written notice required', text: 'In Chicago: 30, 60, or 120 days depending on how long you have rented the unit.' },
      { label: 'Not mid-lease', text: 'A fixed-term lease locks your rent until the lease ends.' },
    ],
    next_steps: [
      'Check your lease for the end date and any terms about rent changes.',
      'Look at the date on the notice and count the days, make sure it gives you enough warning.',
      'If the notice is too short, or came right after you asked for repairs, call a free tenant hotline before you agree or move.',
    ],
    contactSub: 'Free · all Cook County, any income or status',
    contactWhy: 'They help any Cook County renter understand a notice and their options.',
    contactHow: 'Call and explain your situation, they can review the notice with you.',
    follow_ups: ['What if the notice was too short?', 'Can my landlord raise rent because I asked for repairs?', 'How much notice do I give to move out?'],
  },
  eviction: {
    answer: 'A landlord in Illinois cannot force you out on their own, only a court can order an eviction, and only after a specific process. It usually starts with a written notice: a 5-day notice for unpaid rent, or a 10-day notice for a lease violation. If you fix the problem (for example, pay the rent) within a 5-day notice period, the landlord generally must let you stay. Your landlord cannot change the locks, remove your things, or shut off your utilities to make you leave, that is illegal.',
    key_points: [
      { label: 'Only a court can evict', text: 'A landlord must file a case and win before the sheriff can remove you.' },
      { label: '5-day / 10-day notice', text: '5 days for unpaid rent; 10 days for a lease violation.' },
      { label: 'No self-help', text: 'Lockouts, removing belongings, or shutting off utilities are illegal.' },
    ],
    next_steps: [
      'Keep every notice, letter, and receipt, dates matter a lot.',
      'If it is a 5-day notice, paying the full rent owed within 5 days usually stops it.',
      'Get free legal help right away, do not skip your court date if a case is filed.',
    ],
    contactSub: 'Free eviction help statewide',
    contactWhy: 'Free legal help and mediation for anyone facing eviction in Illinois.',
    contactHow: 'Call, or text “eviction” to 85622 to get connected.',
    follow_ups: ['What happens on my court date?', 'Can my landlord shut off my heat?', 'What if I can’t pay the rent I owe?'],
  },
  deposit: {
    answer: 'When you move out, your landlord must return your security deposit, minus the cost of any damage beyond normal wear and tear. In the City of Chicago, a landlord who keeps part of your deposit must give you an itemized list of the deductions with receipts within 30 days, and must return the rest within 45 days. If a landlord in Chicago does not follow these rules, you may be owed up to two times the deposit plus your actual deposit back.',
    key_points: [
      { label: 'Wear and tear is not damage', text: 'Faded paint and worn carpet are normal, you should not be charged for them.' },
      { label: 'Itemized within 30 days', text: 'Chicago landlords must send a written list of deductions with receipts.' },
      { label: 'Penalties for violations', text: 'A Chicago landlord who breaks the rules may owe you double the deposit.' },
    ],
    next_steps: [
      'Take dated photos of the unit when you move out.',
      'Send your new address to the landlord in writing so they can mail the deposit.',
      'If the deposit is late or wrongly withheld, write a demand letter, then call for free legal help.',
    ],
    contactSub: 'Free legal help · Cook County',
    contactWhy: 'They can tell you if your deposit was wrongly kept and what to do next.',
    contactHow: 'Call the hotline and describe what happened.',
    follow_ups: ['What counts as normal wear and tear?', 'What should my demand letter say?', 'My landlord never gave receipts, now what?'],
  },
  snap: {
    answer: 'SNAP (food stamps) helps you buy groceries, and you apply through the State of Illinois. You can apply online at ABE.illinois.gov, by phone, or in person at a Family Community Resource Center. Whether you qualify depends mostly on your household size and income. After you apply, the state will interview you and ask for documents like ID, proof of income, and housing costs. If you have almost no money or food, you can ask for expedited benefits, which can come within 7 days.',
    key_points: [
      { label: 'Apply at ABE.illinois.gov', text: 'One online application also covers Medicaid and cash assistance.' },
      { label: 'Based on income and household', text: 'Most working families with low income qualify.' },
      { label: 'Emergency SNAP', text: 'Very low income or resources can mean benefits within 7 days.' },
    ],
    next_steps: [
      'Gather ID, proof of income (pay stubs), and your rent or mortgage amount.',
      'Apply online at ABE.illinois.gov or call for help completing it.',
      'Watch for the interview notice, missing it can delay or deny your case.',
    ],
    contactSub: 'Free SNAP application help',
    contactWhy: 'They help you complete the SNAP application for free and answer questions.',
    contactHow: 'Call their benefits outreach line for one-on-one help.',
    follow_ups: ['What income limits apply to SNAP?', 'What if my SNAP was denied?', 'Can I get SNAP if I am not a citizen?'],
  },
  debt: {
    answer: 'Debt collectors have to follow rules. They cannot threaten you, call at all hours, or lie about what you owe, and you can tell them in writing to stop contacting you. A collector generally cannot take money from your paycheck or bank account unless they first sue you and win a court judgment. In Illinois, some income, like Social Security, SSI, and a portion of wages, is protected and cannot be garnished. If you are sued, do not ignore it: showing up (or filing a written appearance) protects your rights.',
    key_points: [
      { label: 'Collectors have limits', text: 'No threats, no calls before 8am or after 9pm, no lying.' },
      { label: 'They must sue first', text: 'No garnishment without a court judgment.' },
      { label: 'Some money is protected', text: 'Social Security, SSI, and part of your wages are exempt.' },
    ],
    next_steps: [
      'Keep a log of calls (date, time, what was said) and any letters.',
      'If you are sued, respond by the deadline, never ignore court papers.',
      'Call a free legal-aid hotline to check what income of yours is protected.',
    ],
    contactSub: 'Free legal help · Cook County',
    contactWhy: 'They advise on debt, collection, and garnishment for free.',
    contactHow: 'Call and explain who is contacting you and about what.',
    follow_ups: ['How do I stop collector calls?', 'What part of my wages can be garnished?', 'I was sued, what do I do first?'],
  },
  repair: {
    answer: 'If you own your home and have a low or moderate income, there are grant and loan programs in Illinois that help pay for repairs like roofs, furnaces, plumbing, and accessibility changes. Statewide, the Illinois Housing Development Authority (IHDA) runs home-repair grant programs, and in the City of Chicago the Department of Housing runs roof, porch, and emergency-repair programs. Programs open and close during the year and have income limits, so it helps to ask what is open now.',
    key_points: [
      { label: 'For homeowners', text: 'Most repair grants are for owner-occupied homes with income limits.' },
      { label: 'Statewide + Chicago', text: 'IHDA covers the state; Chicago DOH runs city roof/porch/emergency programs.' },
      { label: 'Timing matters', text: 'Programs open in waves, ask what is accepting applications now.' },
    ],
    next_steps: [
      'Gather your deed, a recent property-tax bill, and proof of income for the household.',
      'Take photos of the repairs you need.',
      'Call IHDA (statewide) or Chicago’s Department of Housing to ask what is open now.',
    ],
    contactSub: 'Statewide home-repair grants',
    contactWhy: 'They administer home-repair grant programs for income-eligible homeowners.',
    contactHow: 'Call or visit ihda.org to see current programs and eligibility.',
    follow_ups: ['What are the income limits?', 'Is there help for a broken furnace right now?', 'Can renters get repairs made?'],
  },
  generic: {
    answer: 'I can point you toward free, trustworthy help. For almost any housing, money, home-repair, or benefits question in Illinois, two great starting points are 211 Metro Chicago, a free 24/7 line that connects you to local help, and Illinois Legal Aid Online, which matches you with free legal aid near you. Tell me a bit more about your situation (for example, rent, an eviction notice, a debt, or applying for benefits) and I can give you more specific next steps.',
    key_points: [
      { label: 'Free help exists', text: 'You do not need to pay a lawyer to get started.' },
      { label: 'Start with 211', text: 'A free 24/7 line that routes you to local resources.' },
    ],
    next_steps: [
      'Call or text 2-1-1 for free, 24/7, to be connected to local help.',
      'Visit illinoislegalaid.org to find free legal aid near you.',
      'Come back and ask about your specific issue for tailored steps.',
    ],
    contactSub: 'Free · 24/7 · connects you to local help',
    contactWhy: 'Real people who route you to the right local resource for your situation.',
    contactHow: 'Call or text 2-1-1 any time, free of charge.',
    follow_ups: ['How much notice before a rent increase?', 'How do I apply for SNAP?', 'A debt collector is calling me, what can I do?'],
  },
}

const ES: Record<string, Content> = {
  "rentIncrease": {
    "answer": "Illinois no tiene un límite sobre cuánto puede subir la renta, ya que la ley estatal prohíbe el control de rentas. Pero su arrendador debe darle un aviso por escrito antes de que empiece un aumento, y no puede subir la renta en medio de un contrato con plazo fijo, a menos que el contrato lo permita. En la Ciudad de Chicago, la Fair Notice Ordinance establece cuánto aviso recibe según el tiempo que haya vivido allí: 30 días si es menos de 6 meses, 60 días si es de 6 meses a 3 años, y 120 días si es más de 3 años.",
    "key_points": [
      {
        "label": "Sin control de rentas",
        "text": "La ley de Illinois prohíbe el control de rentas, así que no hay un máximo legal para el monto."
      },
      {
        "label": "Se requiere aviso por escrito",
        "text": "En Chicago: 30, 60 o 120 días según cuánto tiempo haya rentado la vivienda."
      },
      {
        "label": "No a mitad del contrato",
        "text": "Un contrato con plazo fijo mantiene su renta fija hasta que el contrato termine."
      }
    ],
    "next_steps": [
      "Revise su contrato para ver la fecha de término y cualquier condición sobre cambios en la renta.",
      "Fíjese en la fecha del aviso y cuente los días, asegúrese de que le dé suficiente advertencia.",
      "Si el aviso es demasiado corto, o llegó justo después de que usted pidió reparaciones, llame a una línea gratuita para inquilinos antes de aceptar o mudarse."
    ],
    "contactSub": "Gratis · todo el Condado de Cook, cualquier ingreso o estatus",
    "contactWhy": "Ayudan a cualquier inquilino del Condado de Cook a entender un aviso y sus opciones.",
    "contactHow": "Llame y explique su situación, pueden revisar el aviso con usted.",
    "follow_ups": [
      "¿Qué pasa si el aviso fue demasiado corto?",
      "¿Puede mi arrendador subir la renta porque pedí reparaciones?",
      "¿Cuánto aviso debo dar para mudarme?"
    ]
  },
  "eviction": {
    "answer": "Un arrendador en Illinois no puede sacarlo por su cuenta, solo un tribunal puede ordenar un desalojo, y solo después de un proceso específico. Por lo general empieza con un aviso por escrito: un aviso de 5 días por renta no pagada, o un aviso de 10 días por incumplir el contrato. Si usted corrige el problema (por ejemplo, paga la renta) dentro del plazo de un aviso de 5 días, por lo general el arrendador debe dejarlo quedarse. Su arrendador no puede cambiar las cerraduras, sacar sus cosas ni cortarle los servicios públicos para obligarlo a irse, eso es ilegal.",
    "key_points": [
      {
        "label": "Solo un tribunal puede desalojar",
        "text": "Un arrendador debe presentar un caso y ganar antes de que el alguacil pueda sacarlo."
      },
      {
        "label": "Aviso de 5 días / 10 días",
        "text": "5 días por renta no pagada; 10 días por incumplir el contrato."
      },
      {
        "label": "Nada por mano propia",
        "text": "Cambiar cerraduras, sacar sus pertenencias o cortar los servicios públicos es ilegal."
      }
    ],
    "next_steps": [
      "Guarde cada aviso, carta y recibo, las fechas importan mucho.",
      "Si es un aviso de 5 días, pagar toda la renta que debe dentro de 5 días por lo general lo detiene.",
      "Consiga ayuda legal gratuita de inmediato, no falte a su cita en el tribunal si se presenta un caso."
    ],
    "contactSub": "Ayuda gratuita contra desalojos en todo el estado",
    "contactWhy": "Ayuda legal gratuita y mediación para cualquier persona que enfrenta un desalojo en Illinois.",
    "contactHow": "Llame, o envíe un mensaje de texto con la palabra “eviction” al 85622 para conectarse.",
    "follow_ups": [
      "¿Qué pasa en mi cita en el tribunal?",
      "¿Puede mi arrendador cortarme la calefacción?",
      "¿Qué pasa si no puedo pagar la renta que debo?"
    ]
  },
  "deposit": {
    "answer": "Cuando usted se muda, su arrendador debe devolverle su depósito de seguridad, menos el costo de cualquier daño que vaya más allá del desgaste normal por el uso. En la Ciudad de Chicago, un arrendador que se queda con parte de su depósito debe darle una lista detallada de los descuentos con recibos dentro de 30 días, y debe devolver el resto dentro de 45 días. Si un arrendador en Chicago no cumple estas reglas, es posible que le deban hasta dos veces el depósito más la devolución de su depósito real.",
    "key_points": [
      {
        "label": "El desgaste normal no es un daño",
        "text": "La pintura descolorida y la alfombra gastada son normales, no le deben cobrar por ellas."
      },
      {
        "label": "Detallado dentro de 30 días",
        "text": "Los arrendadores de Chicago deben enviar una lista por escrito de los descuentos con recibos."
      },
      {
        "label": "Sanciones por incumplir",
        "text": "Un arrendador de Chicago que rompe las reglas puede deberle el doble del depósito."
      }
    ],
    "next_steps": [
      "Tome fotos con fecha de la vivienda cuando se mude.",
      "Envíe su nueva dirección al arrendador por escrito para que puedan enviarle el depósito por correo.",
      "Si el depósito llega tarde o se retiene indebidamente, escriba una carta de reclamo y luego llame para recibir ayuda legal gratuita."
    ],
    "contactSub": "Ayuda legal gratuita · Condado de Cook",
    "contactWhy": "Pueden decirle si su depósito se retuvo indebidamente y qué hacer después.",
    "contactHow": "Llame a la línea directa y describa lo que pasó.",
    "follow_ups": [
      "¿Qué cuenta como desgaste normal por el uso?",
      "¿Qué debe decir mi carta de reclamo?",
      "Mi arrendador nunca me dio recibos, ¿ahora qué?"
    ]
  },
  "snap": {
    "answer": "SNAP (cupones de alimentos) le ayuda a comprar comida, y usted solicita a través del Estado de Illinois. Puede solicitar en línea en ABE.illinois.gov, por teléfono o en persona en un Family Community Resource Center. Si usted califica depende sobre todo del tamaño de su hogar y de sus ingresos. Después de solicitar, el estado lo entrevistará y le pedirá documentos como identificación, comprobante de ingresos y gastos de vivienda. Si casi no tiene dinero ni comida, puede pedir beneficios acelerados, que pueden llegar dentro de 7 días.",
    "key_points": [
      {
        "label": "Solicite en ABE.illinois.gov",
        "text": "Una sola solicitud en línea también cubre Medicaid y asistencia en efectivo."
      },
      {
        "label": "Según ingresos y hogar",
        "text": "La mayoría de las familias trabajadoras con bajos ingresos califican."
      },
      {
        "label": "SNAP de emergencia",
        "text": "Ingresos o recursos muy bajos pueden significar beneficios dentro de 7 días."
      }
    ],
    "next_steps": [
      "Reúna su identificación, comprobante de ingresos (talones de pago) y el monto de su renta o hipoteca.",
      "Solicite en línea en ABE.illinois.gov o llame para recibir ayuda para completarla.",
      "Esté atento al aviso de la entrevista, perderla puede retrasar o negar su caso."
    ],
    "contactSub": "Ayuda gratuita con la solicitud de SNAP",
    "contactWhy": "Le ayudan a completar la solicitud de SNAP gratis y responden sus preguntas.",
    "contactHow": "Llame a su línea de orientación sobre beneficios para recibir ayuda personalizada.",
    "follow_ups": [
      "¿Qué límites de ingresos aplican para SNAP?",
      "¿Qué pasa si me negaron SNAP?",
      "¿Puedo recibir SNAP si no soy ciudadano?"
    ]
  },
  "debt": {
    "answer": "Los cobradores de deudas tienen que seguir reglas. No pueden amenazarlo, llamar a cualquier hora ni mentir sobre lo que usted debe, y usted puede decirles por escrito que dejen de contactarlo. Por lo general, un cobrador no puede quitar dinero de su cheque de pago ni de su cuenta bancaria a menos que primero lo demande y gane un fallo del tribunal. En Illinois, algunos ingresos, como el Social Security, el SSI y una parte de su salario, están protegidos y no se pueden embargar. Si lo demandan, no lo ignore: presentarse (o presentar una comparecencia por escrito) protege sus derechos.",
    "key_points": [
      {
        "label": "Los cobradores tienen límites",
        "text": "Sin amenazas, sin llamadas antes de las 8am ni después de las 9pm, sin mentiras."
      },
      {
        "label": "Primero deben demandar",
        "text": "No hay embargo sin un fallo del tribunal."
      },
      {
        "label": "Parte del dinero está protegido",
        "text": "El Social Security, el SSI y parte de su salario están exentos."
      }
    ],
    "next_steps": [
      "Lleve un registro de las llamadas (fecha, hora, lo que se dijo) y de cualquier carta.",
      "Si lo demandan, responda antes de la fecha límite, nunca ignore los documentos del tribunal.",
      "Llame a una línea directa de ayuda legal gratuita para verificar qué parte de sus ingresos está protegida."
    ],
    "contactSub": "Ayuda legal gratuita · Condado de Cook",
    "contactWhy": "Asesoran sobre deudas, cobros y embargos de forma gratuita.",
    "contactHow": "Llame y explique quién lo está contactando y por qué.",
    "follow_ups": [
      "¿Cómo detengo las llamadas de los cobradores?",
      "¿Qué parte de mi salario se puede embargar?",
      "Me demandaron, ¿qué hago primero?"
    ]
  },
  "repair": {
    "answer": "Si usted es dueño de su casa y tiene ingresos bajos o moderados, hay programas de subvenciones y préstamos en Illinois que ayudan a pagar reparaciones como techos, calderas, plomería y cambios de accesibilidad. A nivel estatal, Illinois Housing Development Authority (IHDA) administra programas de subvenciones para reparación de viviendas, y en la Ciudad de Chicago el Department of Housing administra programas para techos, pórticos y reparaciones de emergencia. Los programas abren y cierran durante el año y tienen límites de ingresos, así que conviene preguntar qué está abierto ahora.",
    "key_points": [
      {
        "label": "Para propietarios de vivienda",
        "text": "La mayoría de las subvenciones de reparación son para casas ocupadas por el dueño con límites de ingresos."
      },
      {
        "label": "Todo el estado + Chicago",
        "text": "IHDA cubre el estado; el DOH de Chicago administra programas de la ciudad para techos/pórticos/emergencias."
      },
      {
        "label": "El momento importa",
        "text": "Los programas abren por etapas, pregunte cuál está aceptando solicitudes ahora."
      }
    ],
    "next_steps": [
      "Reúna su escritura, una factura reciente del impuesto a la propiedad y el comprobante de ingresos del hogar.",
      "Tome fotos de las reparaciones que necesita.",
      "Llame a IHDA (todo el estado) o al Department of Housing de Chicago para preguntar qué está abierto ahora."
    ],
    "contactSub": "Subvenciones para reparación de viviendas en todo el estado",
    "contactWhy": "Administran programas de subvenciones para reparación de viviendas para propietarios que cumplen los requisitos de ingresos.",
    "contactHow": "Llame o visite ihda.org para ver los programas actuales y los requisitos.",
    "follow_ups": [
      "¿Cuáles son los límites de ingresos?",
      "¿Hay ayuda para una caldera descompuesta ahora mismo?",
      "¿Pueden los inquilinos conseguir que se hagan reparaciones?"
    ]
  },
  "generic": {
    "answer": "Puedo orientarlo hacia ayuda gratuita y confiable. Para casi cualquier pregunta sobre vivienda, dinero, reparación del hogar o beneficios en Illinois, dos excelentes puntos de partida son 211 Metro Chicago, una línea gratuita disponible 24/7 que lo conecta con ayuda local, e Illinois Legal Aid Online, que lo conecta con ayuda legal gratuita cerca de usted. Cuénteme un poco más sobre su situación (por ejemplo, la renta, un aviso de desalojo, una deuda o solicitar beneficios) y puedo darle pasos más específicos a seguir.",
    "key_points": [
      {
        "label": "Existe ayuda gratuita",
        "text": "No necesita pagarle a un abogado para empezar."
      },
      {
        "label": "Empiece con 211",
        "text": "Una línea gratuita disponible 24/7 que lo dirige a recursos locales."
      }
    ],
    "next_steps": [
      "Llame o envíe un mensaje de texto al 2-1-1 gratis, 24/7, para conectarse con ayuda local.",
      "Visite illinoislegalaid.org para encontrar ayuda legal gratuita cerca de usted.",
      "Regrese y pregunte sobre su asunto específico para recibir pasos personalizados."
    ],
    "contactSub": "Gratis · 24/7 · lo conecta con ayuda local",
    "contactWhy": "Personas reales que lo dirigen al recurso local correcto para su situación.",
    "contactHow": "Llame o envíe un mensaje de texto al 2-1-1 en cualquier momento, sin costo.",
    "follow_ups": [
      "¿Cuánto aviso antes de un aumento de renta?",
      "¿Cómo solicito SNAP?",
      "Un cobrador de deudas me está llamando, ¿qué puedo hacer?"
    ]
  }
}

const ZH: Record<string, Content> = {
  "rentIncrease": {
    "answer": "Illinois 对房租可以上涨多少没有上限, 州法律禁止租金管制。但在涨租开始前，房东必须以书面形式提前通知您，而且在固定期限的租约中途不得涨租，除非租约允许这样做。在 Chicago 市，Fair Notice Ordinance 根据您居住时间的长短规定了提前通知的天数：居住不满 6 个月为 30 天，居住 6 个月到 3 年为 60 天，居住超过 3 年为 120 天。",
    "key_points": [
      {
        "label": "没有租金管制",
        "text": "Illinois 法律禁止租金管制，所以对涨租金额没有法定上限。"
      },
      {
        "label": "必须书面通知",
        "text": "在 Chicago：根据您租住该单元的时间长短，需提前 30、60 或 120 天通知。"
      },
      {
        "label": "租约中途不得涨租",
        "text": "固定期限的租约会锁定您的租金，直到租约结束。"
      }
    ],
    "next_steps": [
      "查看您的租约，确认结束日期以及关于租金变动的任何条款。",
      "看看通知上的日期，数一数天数, 确认它给了您足够的提前通知。",
      "如果通知时间太短，或者是在您要求维修后紧接着发来的，请在您同意或搬走之前拨打免费的租客热线。"
    ],
    "contactSub": "免费 · 服务整个 Cook County，不论收入或身份",
    "contactWhy": "他们帮助 Cook County 的任何租客理解通知内容以及可以采取的选择。",
    "contactHow": "打电话说明您的情况, 他们可以和您一起审阅通知。",
    "follow_ups": [
      "如果通知时间太短怎么办？",
      "我要求维修后，房东可以因此涨租吗？",
      "我搬走需要提前多久通知？"
    ]
  },
  "eviction": {
    "answer": "在 Illinois，房东不能自行强迫您搬走, 只有法院才能下令驱逐，而且必须经过特定的程序之后。通常从一份书面通知开始：欠租会收到 5 天通知，违反租约会收到 10 天通知。如果您在 5 天通知期内解决了问题（例如付清租金），房东通常必须让您继续居住。房东不能通过换锁、搬走您的物品或切断您的水电来逼您离开, 那样做是违法的。",
    "key_points": [
      {
        "label": "只有法院能驱逐",
        "text": "房东必须提起诉讼并胜诉，警长才能把您赶出去。"
      },
      {
        "label": "5 天 / 10 天通知",
        "text": "欠租 5 天；违反租约 10 天。"
      },
      {
        "label": "禁止私力驱逐",
        "text": "换锁、搬走物品或切断水电都是违法的。"
      }
    ],
    "next_steps": [
      "保留每一份通知、信件和收据, 日期非常重要。",
      "如果是 5 天通知，在 5 天内付清所欠的全部租金通常可以阻止驱逐。",
      "立即寻求免费法律帮助, 如果对方提起了诉讼，千万不要错过您的开庭日期。"
    ],
    "contactSub": "全州范围的免费驱逐帮助",
    "contactWhy": "为 Illinois 面临驱逐的任何人提供免费法律帮助和调解。",
    "contactHow": "打电话，或发短信 “eviction” 到 85622 即可获得帮助。",
    "follow_ups": [
      "我开庭那天会发生什么？",
      "房东可以切断我的暖气吗？",
      "如果我付不起所欠的租金怎么办？"
    ]
  },
  "deposit": {
    "answer": "当您搬走时，房东必须退还您的押金，扣除超出正常磨损范围的任何损坏费用。在 Chicago 市，扣留部分押金的房东必须在 30 天内向您提供一份列明各项扣款并附有收据的清单，并且必须在 45 天内退还余款。如果 Chicago 的房东不遵守这些规定，您可能有权拿回相当于押金两倍的赔偿，外加您的实际押金。",
    "key_points": [
      {
        "label": "正常磨损不算损坏",
        "text": "褪色的油漆和磨损的地毯是正常的, 您不应为此被收费。"
      },
      {
        "label": "30 天内列明清单",
        "text": "Chicago 的房东必须寄出一份列明扣款并附收据的书面清单。"
      },
      {
        "label": "违规会受处罚",
        "text": "违反规定的 Chicago 房东可能需要向您赔偿双倍押金。"
      }
    ],
    "next_steps": [
      "搬走时给单元拍下带日期的照片。",
      "以书面形式把您的新地址告知房东，以便他们邮寄押金。",
      "如果押金迟迟未退或被错误扣留，先写一封催告信，然后拨打免费法律帮助电话。"
    ],
    "contactSub": "免费法律帮助 · Cook County",
    "contactWhy": "他们可以告诉您押金是否被错误扣留，以及下一步该怎么做。",
    "contactHow": "拨打热线并说明发生了什么。",
    "follow_ups": [
      "什么算正常磨损？",
      "我的催告信应该写些什么？",
      "我的房东从没给过收据, 现在怎么办？"
    ]
  },
  "snap": {
    "answer": "SNAP（食品券）帮助您购买食品，您通过 State of Illinois 申请。您可以在 ABE.illinois.gov 网上申请，也可以通过电话，或亲自到 Family Community Resource Center 申请。您是否符合资格主要取决于您的家庭人数和收入。申请后，州政府会对您进行面谈，并要求您提供证件、收入证明和住房费用等文件。如果您几乎没有钱或食物，您可以申请加急福利，最快可在 7 天内到账。",
    "key_points": [
      {
        "label": "在 ABE.illinois.gov 申请",
        "text": "一份网上申请同时也涵盖 Medicaid 和现金援助。"
      },
      {
        "label": "以收入和家庭人数为准",
        "text": "大多数低收入的工薪家庭符合资格。"
      },
      {
        "label": "紧急 SNAP",
        "text": "收入或资产极低可能意味着 7 天内拿到福利。"
      }
    ],
    "next_steps": [
      "准备好证件、收入证明（工资单）以及您的房租或房贷金额。",
      "在 ABE.illinois.gov 网上申请，或打电话请人帮您完成申请。",
      "留意面谈通知, 错过它可能会延误或导致您的申请被拒。"
    ],
    "contactSub": "免费的 SNAP 申请帮助",
    "contactWhy": "他们免费帮助您完成 SNAP 申请并解答疑问。",
    "contactHow": "拨打他们的福利外展专线获取一对一帮助。",
    "follow_ups": [
      "SNAP 有哪些收入限制？",
      "如果我的 SNAP 被拒了怎么办？",
      "如果我不是公民，可以申请 SNAP 吗？"
    ]
  },
  "debt": {
    "answer": "讨债人必须遵守规则。他们不能威胁您、不能在任何时间随意打电话、也不能谎报您欠的金额，而且您可以书面通知他们停止联系您。讨债人通常不能从您的工资或银行账户中扣钱，除非他们先起诉您并赢得法院判决。在 Illinois，某些收入, 如 Social Security、SSI 以及一部分工资, 受到保护，不能被扣押。如果您被起诉，不要置之不理：出庭（或提交书面应诉）可以保护您的权利。",
    "key_points": [
      {
        "label": "讨债人有限制",
        "text": "不得威胁，不得在早上 8am 之前或晚上 9pm 之后打电话，不得撒谎。"
      },
      {
        "label": "他们必须先起诉",
        "text": "没有法院判决就不能扣押您的收入。"
      },
      {
        "label": "部分钱款受保护",
        "text": "Social Security、SSI 以及您的一部分工资是豁免的。"
      }
    ],
    "next_steps": [
      "记录来电情况（日期、时间、说了什么）以及任何信件。",
      "如果您被起诉，请在截止日期前作出回应, 绝不要忽视法院文件。",
      "拨打免费的法律援助热线，了解您哪些收入受到保护。"
    ],
    "contactSub": "免费法律帮助 · Cook County",
    "contactWhy": "他们免费就债务、催收和扣押收入提供建议。",
    "contactHow": "打电话说明是谁在联系您以及为了什么事。",
    "follow_ups": [
      "我怎样才能让讨债电话停下来？",
      "我的工资中有多少可以被扣押？",
      "我被起诉了, 我该先做什么？"
    ]
  },
  "repair": {
    "answer": "如果您拥有自己的住房且收入为中低水平，Illinois 有一些拨款和贷款项目，可帮助支付屋顶、暖炉、管道和无障碍改造等维修费用。在全州范围内，Illinois Housing Development Authority (IHDA) 运营住房维修拨款项目；在 Chicago 市，Department of Housing 运营屋顶、门廊和紧急维修项目。这些项目在一年中会开放和关闭，并有收入限制，所以询问目前哪些项目正在开放会很有帮助。",
    "key_points": [
      {
        "label": "面向房主",
        "text": "大多数维修拨款面向业主自住的住房，并有收入限制。"
      },
      {
        "label": "全州 + Chicago",
        "text": "IHDA 覆盖全州；Chicago DOH 运营市里的屋顶/门廊/紧急项目。"
      },
      {
        "label": "时机很重要",
        "text": "项目分批开放, 询问目前哪些正在接受申请。"
      }
    ],
    "next_steps": [
      "准备好您的房契、最近的房产税单以及全家的收入证明。",
      "给您需要维修的地方拍照。",
      "拨打 IHDA（全州）或 Chicago 的 Department of Housing，询问目前哪些项目正在开放。"
    ],
    "contactSub": "全州范围的住房维修拨款",
    "contactWhy": "他们为符合收入条件的房主管理住房维修拨款项目。",
    "contactHow": "打电话或访问 ihda.org 查看当前的项目和资格要求。",
    "follow_ups": [
      "收入限制是多少？",
      "现在有针对坏了的暖炉的帮助吗？",
      "租客可以让房东做维修吗？"
    ]
  },
  "generic": {
    "answer": "我可以为您指引免费、可信赖的帮助。对于 Illinois 几乎所有关于住房、金钱、住房维修或福利的问题，有两个很好的起点：211 Metro Chicago, 一条免费的全天候热线，为您接通本地帮助；以及 Illinois Legal Aid Online，它会为您匹配附近的免费法律援助。请再多告诉我一些您的情况（例如房租、驱逐通知、债务，或申请福利），我就能给您更具体的下一步建议。",
    "key_points": [
      {
        "label": "免费帮助是存在的",
        "text": "您不需要付钱请律师就能开始。"
      },
      {
        "label": "从 211 开始",
        "text": "一条免费的全天候热线，为您接通本地资源。"
      }
    ],
    "next_steps": [
      "拨打或发短信 2-1-1，免费、全天候，为您接通本地帮助。",
      "访问 illinoislegalaid.org 寻找您附近的免费法律援助。",
      "回来就您的具体问题提问，获取量身定制的步骤。"
    ],
    "contactSub": "免费 · 全天候 · 为您接通本地帮助",
    "contactWhy": "真人为您接通最适合您情况的本地资源。",
    "contactHow": "随时免费拨打或发短信 2-1-1。",
    "follow_ups": [
      "涨租前需要提前多久通知？",
      "我要怎么申请 SNAP？",
      "有讨债人在给我打电话, 我能怎么办？"
    ]
  }
}

const TL: Record<string, Content> = {
  "rentIncrease": {
    "answer": "Walang limitasyon ang Illinois sa kung magkano maaaring tumaas ang upa, ipinagbabawal ng batas ng estado ang rent control. Ngunit kailangang bigyan ka ng iyong landlord ng nakasulat na abiso bago magsimula ang pagtaas, at hindi puwedeng itaas ang upa sa gitna ng isang fixed-term na lease maliban kung pinapayagan ito ng lease. Sa City of Chicago, itinatakda ng Fair Notice Ordinance kung gaano katagal na babala ang matatanggap mo batay sa kung gaano ka na katagal nakatira roon: 30 days kung wala pang 6 na buwan, 60 days kung 6 na buwan hanggang 3 taon, at 120 days kung mahigit 3 taon.",
    "key_points": [
      {
        "label": "Walang rent control",
        "text": "Ipinagbabawal ng batas ng Illinois ang rent control, kaya walang legal na maximum sa halaga."
      },
      {
        "label": "Kailangan ng nakasulat na abiso",
        "text": "Sa Chicago: 30, 60, o 120 days depende sa kung gaano na katagal mong inuupahan ang yunit."
      },
      {
        "label": "Hindi sa gitna ng lease",
        "text": "Nilo-lock ng fixed-term na lease ang iyong upa hanggang matapos ang lease."
      }
    ],
    "next_steps": [
      "Tingnan ang iyong lease para sa petsa ng pagtatapos at anumang tuntunin tungkol sa pagbabago ng upa.",
      "Tingnan ang petsa sa abiso at bilangin ang mga araw, siguraduhing sapat ang babalang ibinibigay nito.",
      "Kung masyadong maikli ang abiso, o dumating ito matapos kang humingi ng mga pagkukumpuni, tumawag sa isang libreng tenant hotline bago ka pumayag o umalis."
    ],
    "contactSub": "Libre · buong Cook County, anumang kita o katayuan",
    "contactWhy": "Tinutulungan nila ang sinumang umuupa sa Cook County na maintindihan ang isang abiso at ang kanilang mga opsyon.",
    "contactHow": "Tumawag at ipaliwanag ang iyong sitwasyon, puwede nilang suriin ang abiso kasama ka.",
    "follow_ups": [
      "Paano kung masyadong maikli ang abiso?",
      "Puwede bang itaas ng landlord ang upa dahil humingi ako ng pagkukumpuni?",
      "Gaano katagal na abiso ang ibibigay ko para umalis?"
    ]
  },
  "eviction": {
    "answer": "Hindi puwedeng pilit kang paalisin ng landlord sa Illinois nang mag-isa, ang korte lamang ang makakapag-utos ng eviction, at pagkatapos lamang ng isang tiyak na proseso. Karaniwan itong nagsisimula sa isang nakasulat na abiso: isang 5-day notice para sa hindi nabayarang upa, o isang 10-day notice para sa paglabag sa lease. Kung aayusin mo ang problema (halimbawa, babayaran ang upa) sa loob ng 5-day notice period, sa pangkalahatan ay kailangang hayaan ka ng landlord na manatili. Hindi puwedeng palitan ng landlord ang mga kandado, alisin ang iyong mga gamit, o putulin ang iyong mga utility para pilitin kang umalis, labag iyon sa batas.",
    "key_points": [
      {
        "label": "Korte lamang ang makakapag-evict",
        "text": "Kailangang magsampa ng kaso ang landlord at manalo bago ka maaaring paalisin ng sheriff."
      },
      {
        "label": "5-day / 10-day notice",
        "text": "5 days para sa hindi nabayarang upa; 10 days para sa paglabag sa lease."
      },
      {
        "label": "Walang self-help",
        "text": "Labag sa batas ang pag-lockout, pag-alis ng mga gamit, o pagputol ng mga utility."
      }
    ],
    "next_steps": [
      "Itago ang bawat abiso, sulat, at resibo, napakahalaga ng mga petsa.",
      "Kung isa itong 5-day notice, karaniwang napipigil ito ng pagbabayad ng buong upang inuutang sa loob ng 5 days.",
      "Kumuha agad ng libreng tulong legal, huwag laktawan ang iyong court date kung may naisampang kaso."
    ],
    "contactSub": "Libreng tulong sa eviction sa buong estado",
    "contactWhy": "Libreng tulong legal at mediation para sa sinumang nahaharap sa eviction sa Illinois.",
    "contactHow": "Tumawag, o mag-text ng “eviction” sa 85622 para maikonekta.",
    "follow_ups": [
      "Ano ang mangyayari sa aking court date?",
      "Puwede bang putulin ng landlord ang aking init?",
      "Paano kung hindi ko kayang bayaran ang upang inuutang ko?"
    ]
  },
  "deposit": {
    "answer": "Kapag umalis ka, kailangang ibalik ng iyong landlord ang iyong security deposit, na binawasan ng halaga ng anumang pinsalang lampas sa normal na paggamit at pagkaluma. Sa City of Chicago, ang landlord na nagtatago ng bahagi ng iyong deposit ay kailangang bigyan ka ng isang itemized na listahan ng mga bawas kasama ang mga resibo sa loob ng 30 days, at kailangang ibalik ang natitira sa loob ng 45 days. Kung hindi sinusunod ng isang landlord sa Chicago ang mga tuntuning ito, maaari kang may karapatan sa hanggang dalawang beses ng deposit kasama pa ang pagbabalik ng iyong aktuwal na deposit.",
    "key_points": [
      {
        "label": "Ang paggamit at pagkaluma ay hindi pinsala",
        "text": "Normal ang kupas na pintura at gastadong karpet, hindi ka dapat singilin para rito."
      },
      {
        "label": "Itemized sa loob ng 30 days",
        "text": "Kailangang magpadala ang mga landlord sa Chicago ng nakasulat na listahan ng mga bawas kasama ang mga resibo."
      },
      {
        "label": "Parusa para sa mga paglabag",
        "text": "Ang landlord sa Chicago na lumalabag sa mga tuntunin ay maaaring may utang sa iyong doble ng deposit."
      }
    ],
    "next_steps": [
      "Kumuha ng mga litratong may petsa ng yunit kapag umalis ka.",
      "Ipadala ang iyong bagong address sa landlord nang nakasulat para maipadala nila ang deposit.",
      "Kung huli o maling itinago ang deposit, sumulat ng demand letter, pagkatapos ay tumawag para sa libreng tulong legal."
    ],
    "contactSub": "Libreng tulong legal · Cook County",
    "contactWhy": "Masasabi nila kung mali bang itinago ang iyong deposit at kung ano ang susunod na gagawin.",
    "contactHow": "Tumawag sa hotline at ilarawan ang nangyari.",
    "follow_ups": [
      "Ano ang itinuturing na normal na paggamit at pagkaluma?",
      "Ano ang dapat sabihin ng aking demand letter?",
      "Hindi ako binigyan ng landlord ko ng mga resibo, ano na?"
    ]
  },
  "snap": {
    "answer": "Tinutulungan ka ng SNAP (food stamps) na bumili ng mga groseri, at nag-a-apply ka sa pamamagitan ng State of Illinois. Puwede kang mag-apply online sa ABE.illinois.gov, sa telepono, o nang personal sa isang Family Community Resource Center. Ang pagiging kwalipikado mo ay pangunahing nakadepende sa laki ng iyong sambahayan at kita. Pagkatapos mong mag-apply, iinterbyuhin ka ng estado at hihingi ng mga dokumento gaya ng ID, patunay ng kita, at mga gastos sa pabahay. Kung halos wala kang pera o pagkain, puwede kang humingi ng expedited benefits, na maaaring dumating sa loob ng 7 days.",
    "key_points": [
      {
        "label": "Mag-apply sa ABE.illinois.gov",
        "text": "Isang online na aplikasyon ang sumasaklaw din sa Medicaid at cash assistance."
      },
      {
        "label": "Batay sa kita at sambahayan",
        "text": "Karamihan ng mga pamilyang nagtatrabaho na may mababang kita ay kwalipikado."
      },
      {
        "label": "Emergency SNAP",
        "text": "Ang napakababang kita o rekurso ay maaaring mangahulugan ng benepisyo sa loob ng 7 days."
      }
    ],
    "next_steps": [
      "Ipunin ang ID, patunay ng kita (pay stubs), at ang halaga ng iyong upa o mortgage.",
      "Mag-apply online sa ABE.illinois.gov o tumawag para sa tulong sa pagkumpleto nito.",
      "Bantayan ang abiso ng interbyu, ang pagkakalimot dito ay maaaring magpaantala o magtanggi sa iyong kaso."
    ],
    "contactSub": "Libreng tulong sa aplikasyon ng SNAP",
    "contactWhy": "Tinutulungan ka nilang kumpletuhin ang aplikasyon ng SNAP nang libre at sinasagot ang mga tanong.",
    "contactHow": "Tumawag sa kanilang benefits outreach line para sa isa-sa-isang tulong.",
    "follow_ups": [
      "Anong mga limitasyon sa kita ang naaangkop sa SNAP?",
      "Paano kung tinanggihan ang aking SNAP?",
      "Puwede ba akong makakuha ng SNAP kung hindi ako mamamayan?"
    ]
  },
  "debt": {
    "answer": "Kailangang sumunod ang mga debt collector sa mga tuntunin. Hindi ka nila puwedeng bantaan, tawagan sa lahat ng oras, o magsinungaling tungkol sa iyong utang, at puwede mo silang sabihan nang nakasulat na tumigil sa pakikipag-ugnayan sa iyo. Sa pangkalahatan, hindi puwedeng kumuha ang isang collector ng pera mula sa iyong sahod o bank account maliban kung una ka nilang idemanda at manalo ng court judgment. Sa Illinois, ang ilang kita, gaya ng Social Security, SSI, at bahagi ng sahod, ay protektado at hindi maaaring i-garnish. Kung idinemanda ka, huwag itong balewalain: ang pagpunta (o pagsampa ng nakasulat na appearance) ay nagpoprotekta sa iyong mga karapatan.",
    "key_points": [
      {
        "label": "May limitasyon ang mga collector",
        "text": "Walang pagbabanta, walang tawag bago mag-8am o pagkatapos ng 9pm, walang pagsisinungaling."
      },
      {
        "label": "Kailangan muna nilang magdemanda",
        "text": "Walang garnishment nang walang court judgment."
      },
      {
        "label": "May protektadong pera",
        "text": "Protektado ang Social Security, SSI, at bahagi ng iyong sahod."
      }
    ],
    "next_steps": [
      "Magtago ng talaan ng mga tawag (petsa, oras, sinabi) at anumang mga sulat.",
      "Kung idinemanda ka, tumugon bago ang deadline, huwag balewalain ang mga papel ng korte.",
      "Tumawag sa isang libreng legal-aid hotline para tingnan kung aling kita mo ang protektado."
    ],
    "contactSub": "Libreng tulong legal · Cook County",
    "contactWhy": "Nagbibigay sila ng payo tungkol sa utang, koleksyon, at garnishment nang libre.",
    "contactHow": "Tumawag at ipaliwanag kung sino ang nakikipag-ugnayan sa iyo at tungkol saan.",
    "follow_ups": [
      "Paano ko mapapatigil ang mga tawag ng collector?",
      "Anong bahagi ng aking sahod ang maaaring i-garnish?",
      "Idinemanda ako, ano ang una kong gagawin?"
    ]
  },
  "repair": {
    "answer": "Kung nagmamay-ari ka ng iyong tahanan at may mababa o katamtamang kita, may mga programa ng grant at loan sa Illinois na tumutulong bayaran ang mga pagkukumpuni gaya ng bubong, furnace, tubero, at mga pagbabago para sa accessibility. Sa buong estado, ang Illinois Housing Development Authority (IHDA) ay nagpapatakbo ng mga programa ng grant para sa pagkukumpuni ng tahanan, at sa City of Chicago ang Department of Housing ay nagpapatakbo ng mga programa para sa bubong, porch, at emergency-repair. Bumubukas at nagsasara ang mga programa sa loob ng taon at may mga limitasyon sa kita, kaya makakatulong na magtanong kung ano ang bukas ngayon.",
    "key_points": [
      {
        "label": "Para sa mga may-ari ng bahay",
        "text": "Karamihan ng mga repair grant ay para sa mga owner-occupied na bahay na may limitasyon sa kita."
      },
      {
        "label": "Buong estado + Chicago",
        "text": "Sinasaklaw ng IHDA ang estado; nagpapatakbo ang Chicago DOH ng mga programa sa lungsod para sa bubong/porch/emergency."
      },
      {
        "label": "Mahalaga ang timing",
        "text": "Bumubukas ang mga programa nang paunti-unti, magtanong kung ano ang tumatanggap ng aplikasyon ngayon."
      }
    ],
    "next_steps": [
      "Ipunin ang iyong deed, isang kamakailang bill ng property-tax, at patunay ng kita para sa sambahayan.",
      "Kumuha ng mga litrato ng mga pagkukumpuning kailangan mo.",
      "Tumawag sa IHDA (buong estado) o sa Department of Housing ng Chicago para magtanong kung ano ang bukas ngayon."
    ],
    "contactSub": "Mga grant para sa pagkukumpuni ng tahanan sa buong estado",
    "contactWhy": "Pinangangasiwaan nila ang mga programa ng grant para sa pagkukumpuni ng tahanan para sa mga may-ari ng bahay na kwalipikado ayon sa kita.",
    "contactHow": "Tumawag o bisitahin ang ihda.org para makita ang kasalukuyang mga programa at pagiging kwalipikado.",
    "follow_ups": [
      "Ano ang mga limitasyon sa kita?",
      "May tulong ba para sa sirang furnace ngayon?",
      "Puwede bang makapagpaayos ang mga umuupa?"
    ]
  },
  "generic": {
    "answer": "Maituturo kita sa libre at mapagkakatiwalaang tulong. Para sa halos anumang tanong tungkol sa pabahay, pera, pagkukumpuni ng tahanan, o mga benepisyo sa Illinois, dalawang magagandang panimulang punto ay ang 211 Metro Chicago, isang libreng 24/7 na linya na nag-uugnay sa iyo sa lokal na tulong, at ang Illinois Legal Aid Online, na tumutugma sa iyo sa libreng tulong legal na malapit sa iyo. Sabihin mo sa akin nang kaunti pa ang tungkol sa iyong sitwasyon (halimbawa, upa, isang eviction notice, isang utang, o pag-a-apply para sa mga benepisyo) at makakapagbigay ako ng mas tiyak na mga susunod na hakbang.",
    "key_points": [
      {
        "label": "May libreng tulong",
        "text": "Hindi mo kailangang magbayad ng abogado para makapagsimula."
      },
      {
        "label": "Magsimula sa 211",
        "text": "Isang libreng 24/7 na linya na nag-uugnay sa iyo sa lokal na mga rekurso."
      }
    ],
    "next_steps": [
      "Tumawag o mag-text sa 2-1-1 nang libre, 24/7, para maikonekta sa lokal na tulong.",
      "Bisitahin ang illinoislegalaid.org para maghanap ng libreng tulong legal na malapit sa iyo.",
      "Bumalik at magtanong tungkol sa iyong tiyak na isyu para sa naaangkop na mga hakbang."
    ],
    "contactSub": "Libre · 24/7 · nag-uugnay sa iyo sa lokal na tulong",
    "contactWhy": "Tunay na mga taong nag-uugnay sa iyo sa tamang lokal na rekurso para sa iyong sitwasyon.",
    "contactHow": "Tumawag o mag-text sa 2-1-1 anumang oras, nang libre.",
    "follow_ups": [
      "Gaano katagal na abiso bago tumaas ang upa?",
      "Paano ako mag-a-apply para sa SNAP?",
      "May debt collector na tumatawag sa akin, ano ang magagawa ko?"
    ]
  }
}

const VI: Record<string, Content> = {
  "rentIncrease": {
    "answer": "Illinois không giới hạn mức tăng tiền thuê nhà, luật của tiểu bang cấm việc kiểm soát tiền thuê. Nhưng chủ nhà phải thông báo cho bạn bằng văn bản trước khi việc tăng bắt đầu, và không thể tăng tiền thuê giữa chừng một hợp đồng thuê có thời hạn cố định trừ khi hợp đồng cho phép. Tại thành phố Chicago, Fair Notice Ordinance quy định bạn được báo trước bao lâu dựa trên thời gian bạn đã ở đó: 30 ngày nếu dưới 6 tháng, 60 ngày nếu từ 6 tháng đến 3 năm, và 120 ngày nếu hơn 3 năm.",
    "key_points": [
      {
        "label": "Không kiểm soát tiền thuê",
        "text": "Luật Illinois cấm kiểm soát tiền thuê, nên không có mức tối đa hợp pháp cho số tiền."
      },
      {
        "label": "Bắt buộc thông báo bằng văn bản",
        "text": "Tại Chicago: 30, 60, hoặc 120 ngày tùy vào thời gian bạn đã thuê căn hộ."
      },
      {
        "label": "Không giữa hợp đồng",
        "text": "Hợp đồng thuê có thời hạn cố định giữ nguyên tiền thuê của bạn cho đến khi hợp đồng kết thúc."
      }
    ],
    "next_steps": [
      "Kiểm tra hợp đồng thuê của bạn để biết ngày kết thúc và bất kỳ điều khoản nào về thay đổi tiền thuê.",
      "Xem ngày trên thông báo và đếm số ngày, chắc chắn rằng nó cho bạn đủ thời gian báo trước.",
      "Nếu thông báo quá gấp, hoặc đến ngay sau khi bạn yêu cầu sửa chữa, hãy gọi đường dây nóng miễn phí dành cho người thuê nhà trước khi bạn đồng ý hoặc chuyển đi."
    ],
    "contactSub": "Miễn phí · toàn bộ Cook County, bất kể thu nhập hay tình trạng",
    "contactWhy": "Họ giúp bất kỳ người thuê nhà nào ở Cook County hiểu về một thông báo và các lựa chọn của họ.",
    "contactHow": "Gọi điện và giải thích tình huống của bạn, họ có thể cùng bạn xem lại thông báo.",
    "follow_ups": [
      "Nếu thông báo quá gấp thì sao?",
      "Chủ nhà có thể tăng tiền thuê vì tôi yêu cầu sửa chữa không?",
      "Tôi phải báo trước bao lâu để chuyển đi?"
    ]
  },
  "eviction": {
    "answer": "Chủ nhà ở Illinois không thể tự mình đuổi bạn ra, chỉ có tòa án mới có thể ra lệnh trục xuất, và chỉ sau một quy trình cụ thể. Thông thường nó bắt đầu bằng một thông báo bằng văn bản: thông báo 5 ngày cho tiền thuê chưa trả, hoặc thông báo 10 ngày cho việc vi phạm hợp đồng. Nếu bạn khắc phục vấn đề (ví dụ, trả tiền thuê) trong thời hạn thông báo 5 ngày, chủ nhà thường phải để bạn ở lại. Chủ nhà không thể đổi khóa, dọn đồ đạc của bạn, hoặc cắt tiện ích để buộc bạn rời đi, đó là bất hợp pháp.",
    "key_points": [
      {
        "label": "Chỉ tòa án mới trục xuất được",
        "text": "Chủ nhà phải nộp đơn kiện và thắng trước khi cảnh sát trưởng có thể đưa bạn ra khỏi nhà."
      },
      {
        "label": "Thông báo 5 ngày / 10 ngày",
        "text": "5 ngày cho tiền thuê chưa trả; 10 ngày cho việc vi phạm hợp đồng."
      },
      {
        "label": "Không tự ý xử lý",
        "text": "Khóa cửa không cho vào, dọn đồ đạc, hoặc cắt tiện ích là bất hợp pháp."
      }
    ],
    "next_steps": [
      "Giữ mọi thông báo, thư từ, và biên nhận, ngày tháng rất quan trọng.",
      "Nếu là thông báo 5 ngày, trả toàn bộ tiền thuê còn nợ trong vòng 5 ngày thường sẽ chặn được nó.",
      "Nhận trợ giúp pháp lý miễn phí ngay lập tức, đừng bỏ lỡ ngày ra tòa nếu có đơn kiện được nộp."
    ],
    "contactSub": "Trợ giúp trục xuất miễn phí trên toàn tiểu bang",
    "contactWhy": "Trợ giúp pháp lý miễn phí và hòa giải cho bất kỳ ai đang đối mặt với việc trục xuất ở Illinois.",
    "contactHow": "Gọi điện, hoặc nhắn tin “eviction” đến 85622 để được kết nối.",
    "follow_ups": [
      "Điều gì xảy ra vào ngày tôi ra tòa?",
      "Chủ nhà có thể cắt hệ thống sưởi của tôi không?",
      "Nếu tôi không thể trả tiền thuê tôi đang nợ thì sao?"
    ]
  },
  "deposit": {
    "answer": "Khi bạn chuyển đi, chủ nhà phải trả lại tiền đặt cọc bảo đảm của bạn, trừ đi chi phí cho bất kỳ hư hại nào vượt quá hao mòn thông thường. Tại thành phố Chicago, chủ nhà giữ lại một phần tiền đặt cọc của bạn phải cung cấp cho bạn một danh sách chi tiết các khoản khấu trừ kèm biên nhận trong vòng 30 ngày, và phải trả lại phần còn lại trong vòng 45 ngày. Nếu chủ nhà ở Chicago không tuân theo các quy tắc này, bạn có thể được nhận lại tới hai lần tiền đặt cọc cộng với tiền đặt cọc thực tế của bạn.",
    "key_points": [
      {
        "label": "Hao mòn không phải là hư hại",
        "text": "Sơn phai màu và thảm mòn là bình thường, bạn không nên bị tính phí cho những thứ đó."
      },
      {
        "label": "Chi tiết trong vòng 30 ngày",
        "text": "Chủ nhà ở Chicago phải gửi một danh sách các khoản khấu trừ bằng văn bản kèm biên nhận."
      },
      {
        "label": "Hình phạt cho vi phạm",
        "text": "Chủ nhà ở Chicago vi phạm các quy tắc có thể phải trả bạn gấp đôi tiền đặt cọc."
      }
    ],
    "next_steps": [
      "Chụp ảnh có ghi ngày tháng của căn hộ khi bạn chuyển đi.",
      "Gửi địa chỉ mới của bạn cho chủ nhà bằng văn bản để họ có thể gửi tiền đặt cọc qua bưu điện.",
      "Nếu tiền đặt cọc bị trễ hoặc bị giữ lại sai, hãy viết một lá thư đòi, rồi gọi để nhận trợ giúp pháp lý miễn phí."
    ],
    "contactSub": "Trợ giúp pháp lý miễn phí · Cook County",
    "contactWhy": "Họ có thể cho bạn biết tiền đặt cọc của bạn có bị giữ lại sai hay không và phải làm gì tiếp theo.",
    "contactHow": "Gọi đường dây nóng và mô tả điều đã xảy ra.",
    "follow_ups": [
      "Cái gì được tính là hao mòn thông thường?",
      "Thư đòi của tôi nên viết gì?",
      "Chủ nhà của tôi không bao giờ đưa biên nhận, giờ thì sao?"
    ]
  },
  "snap": {
    "answer": "SNAP (tem phiếu thực phẩm) giúp bạn mua thực phẩm, và bạn nộp đơn qua State of Illinois. Bạn có thể nộp đơn trực tuyến tại ABE.illinois.gov, qua điện thoại, hoặc trực tiếp tại một Family Community Resource Center. Việc bạn có đủ điều kiện hay không phần lớn phụ thuộc vào số người trong hộ gia đình và thu nhập của bạn. Sau khi bạn nộp đơn, tiểu bang sẽ phỏng vấn bạn và yêu cầu các giấy tờ như giấy tờ tùy thân, bằng chứng thu nhập, và chi phí nhà ở. Nếu bạn gần như không có tiền hoặc thực phẩm, bạn có thể yêu cầu trợ cấp khẩn cấp, có thể đến trong vòng 7 ngày.",
    "key_points": [
      {
        "label": "Nộp đơn tại ABE.illinois.gov",
        "text": "Một đơn trực tuyến cũng bao gồm cả Medicaid và trợ cấp tiền mặt."
      },
      {
        "label": "Dựa trên thu nhập và hộ gia đình",
        "text": "Hầu hết các gia đình đi làm có thu nhập thấp đều đủ điều kiện."
      },
      {
        "label": "SNAP khẩn cấp",
        "text": "Thu nhập hoặc tài sản rất thấp có thể có nghĩa là nhận trợ cấp trong vòng 7 ngày."
      }
    ],
    "next_steps": [
      "Chuẩn bị giấy tờ tùy thân, bằng chứng thu nhập (cuống lương), và số tiền thuê nhà hoặc tiền trả góp nhà của bạn.",
      "Nộp đơn trực tuyến tại ABE.illinois.gov hoặc gọi để được giúp hoàn thành đơn.",
      "Chú ý thông báo phỏng vấn, bỏ lỡ nó có thể làm chậm trễ hoặc từ chối hồ sơ của bạn."
    ],
    "contactSub": "Trợ giúp nộp đơn SNAP miễn phí",
    "contactWhy": "Họ giúp bạn hoàn thành đơn SNAP miễn phí và trả lời các câu hỏi.",
    "contactHow": "Gọi đường dây hỗ trợ trợ cấp của họ để được giúp đỡ trực tiếp một-một.",
    "follow_ups": [
      "Giới hạn thu nhập nào áp dụng cho SNAP?",
      "Nếu SNAP của tôi bị từ chối thì sao?",
      "Tôi có thể nhận SNAP nếu tôi không phải là công dân không?"
    ]
  },
  "debt": {
    "answer": "Người thu nợ phải tuân theo các quy tắc. Họ không thể đe dọa bạn, gọi điện vào mọi giờ, hoặc nói dối về số tiền bạn nợ, và bạn có thể yêu cầu họ bằng văn bản ngừng liên lạc với bạn. Người thu nợ thường không thể lấy tiền từ tiền lương hoặc tài khoản ngân hàng của bạn trừ khi họ kiện bạn trước và thắng một phán quyết của tòa án. Ở Illinois, một số thu nhập, như Social Security, SSI, và một phần tiền lương, được bảo vệ và không thể bị tịch thu. Nếu bạn bị kiện, đừng phớt lờ: có mặt (hoặc nộp văn bản trình diện) sẽ bảo vệ quyền của bạn.",
    "key_points": [
      {
        "label": "Người thu nợ có giới hạn",
        "text": "Không đe dọa, không gọi trước 8am hoặc sau 9pm, không nói dối."
      },
      {
        "label": "Họ phải kiện trước",
        "text": "Không tịch thu nếu không có phán quyết của tòa án."
      },
      {
        "label": "Một số tiền được bảo vệ",
        "text": "Social Security, SSI, và một phần tiền lương của bạn được miễn."
      }
    ],
    "next_steps": [
      "Ghi lại nhật ký các cuộc gọi (ngày, giờ, nội dung đã nói) và mọi lá thư.",
      "Nếu bạn bị kiện, hãy phản hồi trước hạn chót, đừng bao giờ phớt lờ giấy tờ của tòa án.",
      "Gọi đường dây nóng trợ giúp pháp lý miễn phí để kiểm tra thu nhập nào của bạn được bảo vệ."
    ],
    "contactSub": "Trợ giúp pháp lý miễn phí · Cook County",
    "contactWhy": "Họ tư vấn miễn phí về nợ, thu nợ, và tịch thu.",
    "contactHow": "Gọi điện và giải thích ai đang liên lạc với bạn và về việc gì.",
    "follow_ups": [
      "Làm sao để tôi ngừng các cuộc gọi của người thu nợ?",
      "Phần nào của tiền lương của tôi có thể bị tịch thu?",
      "Tôi bị kiện, tôi phải làm gì đầu tiên?"
    ]
  },
  "repair": {
    "answer": "Nếu bạn sở hữu nhà và có thu nhập thấp hoặc trung bình, có các chương trình trợ cấp và cho vay ở Illinois giúp trả chi phí sửa chữa như mái nhà, lò sưởi, hệ thống ống nước, và các thay đổi để dễ tiếp cận. Trên toàn tiểu bang, Illinois Housing Development Authority (IHDA) điều hành các chương trình trợ cấp sửa nhà, và tại thành phố Chicago, Department of Housing điều hành các chương trình sửa mái nhà, hiên nhà, và sửa chữa khẩn cấp. Các chương trình mở và đóng trong năm và có giới hạn thu nhập, nên sẽ hữu ích khi hỏi hiện đang có chương trình nào mở.",
    "key_points": [
      {
        "label": "Dành cho chủ nhà",
        "text": "Hầu hết các khoản trợ cấp sửa chữa dành cho nhà do chủ sở hữu ở, với giới hạn thu nhập."
      },
      {
        "label": "Toàn tiểu bang + Chicago",
        "text": "IHDA phụ trách toàn tiểu bang; Chicago DOH điều hành các chương trình mái nhà/hiên nhà/khẩn cấp của thành phố."
      },
      {
        "label": "Thời điểm quan trọng",
        "text": "Các chương trình mở theo từng đợt, hãy hỏi cái nào đang nhận đơn ngay bây giờ."
      }
    ],
    "next_steps": [
      "Chuẩn bị giấy chứng nhận quyền sở hữu, hóa đơn thuế bất động sản gần đây, và bằng chứng thu nhập của hộ gia đình.",
      "Chụp ảnh những chỗ cần sửa chữa.",
      "Gọi IHDA (toàn tiểu bang) hoặc Department of Housing của Chicago để hỏi hiện đang có chương trình nào mở."
    ],
    "contactSub": "Trợ cấp sửa nhà toàn tiểu bang",
    "contactWhy": "Họ quản lý các chương trình trợ cấp sửa nhà cho chủ nhà đủ điều kiện về thu nhập.",
    "contactHow": "Gọi điện hoặc truy cập ihda.org để xem các chương trình hiện tại và điều kiện đủ.",
    "follow_ups": [
      "Giới hạn thu nhập là bao nhiêu?",
      "Có trợ giúp cho lò sưởi bị hỏng ngay bây giờ không?",
      "Người thuê nhà có thể được sửa chữa không?"
    ]
  },
  "generic": {
    "answer": "Tôi có thể chỉ cho bạn hướng đến sự trợ giúp miễn phí và đáng tin cậy. Đối với hầu hết mọi câu hỏi về nhà ở, tiền bạc, sửa nhà, hoặc trợ cấp ở Illinois, hai điểm khởi đầu tuyệt vời là 211 Metro Chicago, một đường dây miễn phí 24/7 kết nối bạn với sự trợ giúp tại địa phương, và Illinois Legal Aid Online, giúp kết nối bạn với trợ giúp pháp lý miễn phí gần bạn. Hãy cho tôi biết thêm một chút về tình huống của bạn (ví dụ, tiền thuê, một thông báo trục xuất, một khoản nợ, hoặc nộp đơn xin trợ cấp) và tôi có thể đưa ra các bước tiếp theo cụ thể hơn.",
    "key_points": [
      {
        "label": "Có sự trợ giúp miễn phí",
        "text": "Bạn không cần phải trả tiền cho luật sư để bắt đầu."
      },
      {
        "label": "Bắt đầu với 211",
        "text": "Một đường dây miễn phí 24/7 kết nối bạn với các nguồn lực tại địa phương."
      }
    ],
    "next_steps": [
      "Gọi hoặc nhắn tin 2-1-1 miễn phí, 24/7, để được kết nối với sự trợ giúp tại địa phương.",
      "Truy cập illinoislegalaid.org để tìm trợ giúp pháp lý miễn phí gần bạn.",
      "Quay lại và hỏi về vấn đề cụ thể của bạn để nhận các bước phù hợp riêng."
    ],
    "contactSub": "Miễn phí · 24/7 · kết nối bạn với sự trợ giúp tại địa phương",
    "contactWhy": "Những người thật kết nối bạn với nguồn lực địa phương phù hợp cho tình huống của bạn.",
    "contactHow": "Gọi hoặc nhắn tin 2-1-1 bất cứ lúc nào, miễn phí.",
    "follow_ups": [
      "Được báo trước bao lâu trước khi tăng tiền thuê?",
      "Làm sao để tôi nộp đơn xin SNAP?",
      "Một người thu nợ đang gọi cho tôi, tôi có thể làm gì?"
    ]
  }
}

const CONTENT: Record<string, Record<string, Content>> = { en: EN, es: ES, zh: ZH, tl: TL, vi: VI }

function buildResponse(meta: DemoMeta, c: Content, lang: string): AskResponse {
  const contact: Contact = {
    name: meta.contact.name,
    sub: c.contactSub,
    why: c.contactWhy,
    how: c.contactHow,
    phone: meta.contact.phone,
    hours: meta.contact.hours,
    url: meta.contact.url,
  }
  return {
    topic: meta.topic,
    confidence: meta.confidence,
    answer: c.answer,
    key_points: c.key_points,
    next_steps: c.next_steps,
    contact,
    sources: meta.sources,
    follow_ups: c.follow_ups,
    disclaimer: DISCLAIMER[lang] ?? DISCLAIMER.en,
    refused: false,
  }
}

/**
 * Returns a curated, real-looking answer for the question in the given language,
 * or the generic safe fallback. Used only when the live answer engine is
 * unavailable, so a demo never shows an error card.
 */
export function matchDemoAnswer(question: string, subject?: string, language: Language = 'en'): AskResponse {
  const q = question.toLowerCase()
  const byKeyword = DEMO_META.filter((d) => d.keywords.some((k) => q.includes(k)))
  let meta: DemoMeta | undefined
  if (byKeyword.length) {
    meta = (subject ? byKeyword.find((d) => d.subjects?.includes(subject)) : undefined) ?? byKeyword[0]
  } else if (subject) {
    meta = DEMO_META.find((d) => d.subjects?.includes(subject))
  }
  const chosen = meta ?? GENERIC_META
  const content = CONTENT[language]?.[chosen.id] ?? EN[chosen.id]
  return buildResponse(chosen, content, language)
}
