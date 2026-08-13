import { TopicPage } from '../components/TopicPage'
import { useLanguage, Language } from '../lib/translations'

// Per-language content for the Housing topic page. English is the source of
// truth; es/zh/tl/vi are machine-drafted and PENDING NATIVE-SPEAKER REVIEW.
// Statute citations (the `source`/`meta` fields) stay in English on purpose.

interface FAQ { q: string; a: string; source: string }
interface Program { name: string; amount: string; meta: string; body: string; cta: string; meta2: string }
interface Step { title: string; body: string }
interface Referral {
  sticker: string; title: string; orgName: string; orgSub: string; orgDesc: string
  websiteLabel: string; website: string; phoneLabel: string; phone: string
  bringLabel: string; bring: string[]; startBtn: string; otherBtn: string
}
interface TopicContent {
  parentLabel: string; eyebrow: string; title: string; sub: string
  quickNav: { id: string; label: string }[]
  summary: string; faqs: FAQ[]; programs: Program[]; steps: Step[]; referral: Referral
}

const CONTENT: Record<'en', TopicContent> & Partial<Record<Language, TopicContent>> = {
  en: {
    parentLabel: 'Housing & Rent',
    eyebrow: 'Housing & rent',
    title: 'Your rights as a tenant in Illinois.',
    sub: 'Eviction, rent increases, security deposits, repairs, and what to do if your landlord breaks the rules.',
    quickNav: [
      { id: 'summary', label: 'Summary' },
      { id: 'questions', label: 'Common questions' },
      { id: 'programs', label: 'Rules & protections' },
      { id: 'action', label: 'What to do' },
      { id: 'help', label: 'Get help' },
    ],
    summary: 'In Chicago, tenants are protected by the Residential Landlord and Tenant Ordinance (RLTO) and the Fair Notice Ordinance. These rules cover how much notice your landlord must give before raising rent or ending your lease, how security deposits must be handled, what landlords must do to keep your home livable, and what you can do if they break the rules. Outside Chicago, Illinois state law sets minimum standards but offers fewer specific protections.',
    faqs: [
      { q: 'How much notice does my landlord need to give to raise my rent?', a: 'In Chicago, written notice must be given 30 days in advance if you have lived there less than 6 months, 60 days if 6 months to 3 years, and 120 days if more than 3 years. Outside Chicago, Illinois state law requires 30 days notice for month-to-month tenancies.', source: 'Chicago RLTO §5-12-130 and Chicago Fair Notice Ordinance' },
      { q: 'My landlord has not returned my security deposit. What can I do?', a: 'Illinois law requires deposits to be returned within 30 days for itemized deductions, or 45 days if no deductions. If your landlord fails to do this, you may be entitled to twice the deposit amount plus court costs and attorney fees.', source: 'Illinois Security Deposit Return Act' },
      { q: 'There is no heat in my apartment. Does my landlord have to fix it?', a: 'Yes. In Chicago, landlords must provide heat from September 15 through June 1, with minimum temperatures of 68 degrees during the day and 66 degrees at night. If your landlord fails to provide heat, you can call 311, withhold rent in some cases, or sue for damages.', source: 'Chicago Municipal Code 5-12-110' },
      { q: 'My landlord wants to evict me. How long does the process take?', a: 'Generally, evictions in Illinois take between 30 and 90 days from start to finish. Your landlord must first give you written notice (5, 10, or 30 days depending on the reason), then file a court case, and then get a judgment from a judge before the sheriff can remove you. You cannot be locked out without a court order.', source: 'Illinois Eviction Act, 735 ILCS 5/9-101' },
    ],
    programs: [
      { name: 'Chicago Residential Landlord and Tenant Ordinance (RLTO)', amount: 'Chicago', meta: 'Chicago Municipal Code §5-12', body: 'The RLTO is the main law that protects renters in Chicago. It covers security deposits, repairs, heat requirements, landlord access rules, lease termination, and tenant remedies. It applies to almost all rental units in the city, with a few exceptions for owner-occupied buildings of 6 units or fewer.', cta: 'Read the RLTO', meta2: 'Applies to most Chicago rentals' },
      { name: 'Chicago Fair Notice Ordinance', amount: 'Chicago', meta: 'Effective July 2020', body: 'This ordinance requires longer notice periods before a landlord can raise rent or end a lease, depending on how long you have lived there. It is meant to give tenants more time to find a new place if they cannot afford an increase.', cta: 'Learn more', meta2: '30 / 60 / 120 day notice rules' },
      { name: 'Illinois Eviction Act', amount: 'Statewide', meta: '735 ILCS 5/9', body: 'This state law governs how evictions must proceed. It requires landlords to give written notice, file a court case, and get a judgment before any tenant can be removed. Self-help evictions like changing the locks or shutting off utilities are illegal.', cta: 'Read the statute', meta2: 'All of Illinois' },
    ],
    steps: [
      { title: 'Document everything in writing.', body: 'Take photos, save text messages, and write down dates of any conversations. Keep copies of every notice your landlord gives you.' },
      { title: 'Send written notice yourself.', body: 'If your landlord is not fixing a repair, write a dated letter (keep a copy) describing the problem and giving them a reasonable time to fix it.' },
      { title: 'Call 311 for habitability issues.', body: 'In Chicago, 311 can dispatch a building inspector for issues like no heat, mold, pests, or unsafe conditions. The inspection report can support your case later.' },
      { title: 'Do not pay cash without a receipt.', body: 'If you must pay rent in cash, always get a signed and dated receipt. This protects you if your landlord later claims you did not pay.' },
      { title: 'Get free legal help before things escalate.', body: 'Do not wait until you are in court. Call a legal aid organization as soon as a problem starts so they can help you respond correctly.' },
    ],
    referral: {
      sticker: 'Start here', title: 'Illinois Legal Aid Online, Get Legal Help',
      orgName: 'Statewide referral platform', orgSub: 'Routes you to the right legal aid lawyer for your case',
      orgDesc: 'Answer a few questions and ILAO will connect you with a free legal aid attorney near you. They handle eviction, repairs, security deposits, and more. Available in English and Spanish.',
      websiteLabel: 'Website', website: 'illinoislegalaid.org', phoneLabel: 'Phone', phone: '311 in Chicago',
      bringLabel: 'Bring these with you', bring: ['Your lease', 'Any notices you got', 'Photo ID', 'Photos of problems', 'Rent receipts'],
      startBtn: 'Start with ILAO →', otherBtn: 'See other orgs',
    },
  },

  es: {
    parentLabel: 'Vivienda y renta',
    eyebrow: 'Vivienda y renta',
    title: 'Tus derechos como inquilino en Illinois.',
    sub: 'Desalojo, aumentos de renta, depósitos de seguridad, reparaciones y qué hacer si tu casero rompe las reglas.',
    quickNav: [
      { id: 'summary', label: 'Resumen' },
      { id: 'questions', label: 'Preguntas comunes' },
      { id: 'programs', label: 'Reglas y protecciones' },
      { id: 'action', label: 'Qué hacer' },
      { id: 'help', label: 'Busca ayuda' },
    ],
    summary: 'En Chicago, los inquilinos están protegidos por la Ordenanza de Arrendador e Inquilino Residencial (RLTO) y la Ordenanza de Aviso Justo. Estas reglas cubren cuánto aviso debe dar tu casero antes de subir la renta o terminar tu contrato, cómo se deben manejar los depósitos de seguridad, qué deben hacer los caseros para mantener tu hogar habitable y qué puedes hacer si rompen las reglas. Fuera de Chicago, la ley estatal de Illinois fija estándares mínimos pero ofrece menos protecciones específicas.',
    faqs: [
      { q: '¿Cuánto aviso debe dar mi casero para subir la renta?', a: 'En Chicago, se debe dar aviso por escrito con 30 días de anticipación si has vivido ahí menos de 6 meses, 60 días si llevas de 6 meses a 3 años, y 120 días si llevas más de 3 años. Fuera de Chicago, la ley estatal de Illinois exige 30 días de aviso para arrendamientos mes a mes.', source: 'Chicago RLTO §5-12-130 and Chicago Fair Notice Ordinance' },
      { q: 'Mi casero no me ha devuelto el depósito de seguridad. ¿Qué puedo hacer?', a: 'La ley de Illinois exige que los depósitos se devuelvan dentro de 30 días si hay deducciones detalladas, o 45 días si no hay deducciones. Si tu casero no lo hace, podrías tener derecho al doble del monto del depósito más los costos de corte y honorarios de abogado.', source: 'Illinois Security Deposit Return Act' },
      { q: 'No hay calefacción en mi apartamento. ¿Mi casero tiene que arreglarla?', a: 'Sí. En Chicago, los caseros deben proveer calefacción del 15 de septiembre al 1 de junio, con temperaturas mínimas de 68 grados durante el día y 66 grados de noche. Si tu casero no provee calefacción, puedes llamar al 311, retener la renta en algunos casos, o demandar por daños.', source: 'Chicago Municipal Code 5-12-110' },
      { q: 'Mi casero quiere desalojarme. ¿Cuánto tarda el proceso?', a: 'Generalmente, los desalojos en Illinois tardan entre 30 y 90 días de principio a fin. Tu casero debe primero darte aviso por escrito (5, 10 o 30 días según el motivo), luego presentar un caso en la corte, y luego obtener un fallo de un juez antes de que el alguacil pueda sacarte. No te pueden cambiar la cerradura sin una orden de la corte.', source: 'Illinois Eviction Act, 735 ILCS 5/9-101' },
    ],
    programs: [
      { name: 'Chicago Residential Landlord and Tenant Ordinance (RLTO)', amount: 'Chicago', meta: 'Chicago Municipal Code §5-12', body: 'La RLTO es la ley principal que protege a los inquilinos en Chicago. Cubre depósitos de seguridad, reparaciones, requisitos de calefacción, reglas de acceso del casero, terminación de contrato y remedios para el inquilino. Aplica a casi todas las unidades de alquiler en la ciudad, con algunas excepciones para edificios ocupados por el dueño de 6 unidades o menos.', cta: 'Leer la RLTO', meta2: 'Aplica a la mayoría de alquileres en Chicago' },
      { name: 'Chicago Fair Notice Ordinance', amount: 'Chicago', meta: 'Effective July 2020', body: 'Esta ordenanza exige períodos de aviso más largos antes de que un casero pueda subir la renta o terminar un contrato, según cuánto tiempo hayas vivido ahí. Busca dar a los inquilinos más tiempo para encontrar un nuevo lugar si no pueden pagar un aumento.', cta: 'Más información', meta2: 'Reglas de aviso de 30 / 60 / 120 días' },
      { name: 'Illinois Eviction Act', amount: 'Estatal', meta: '735 ILCS 5/9', body: 'Esta ley estatal rige cómo deben proceder los desalojos. Exige que los caseros den aviso por escrito, presenten un caso en la corte y obtengan un fallo antes de que se pueda sacar a cualquier inquilino. Los desalojos por mano propia, como cambiar las cerraduras o cortar los servicios, son ilegales.', cta: 'Leer la ley', meta2: 'Todo Illinois' },
    ],
    steps: [
      { title: 'Documenta todo por escrito.', body: 'Toma fotos, guarda los mensajes de texto y anota las fechas de cualquier conversación. Guarda copias de cada aviso que te dé tu casero.' },
      { title: 'Envía un aviso por escrito tú mismo.', body: 'Si tu casero no hace una reparación, escribe una carta con fecha (guarda una copia) describiendo el problema y dándole un tiempo razonable para arreglarlo.' },
      { title: 'Llama al 311 por problemas de habitabilidad.', body: 'En Chicago, el 311 puede enviar un inspector de edificios por problemas como falta de calefacción, moho, plagas o condiciones inseguras. El informe de inspección puede apoyar tu caso después.' },
      { title: 'No pagues en efectivo sin un recibo.', body: 'Si debes pagar la renta en efectivo, siempre obtén un recibo firmado y fechado. Esto te protege si tu casero después afirma que no pagaste.' },
      { title: 'Busca ayuda legal gratis antes de que empeore.', body: 'No esperes hasta estar en la corte. Llama a una organización de ayuda legal en cuanto empiece un problema para que te ayuden a responder correctamente.' },
    ],
    referral: {
      sticker: 'Empieza aquí', title: 'Illinois Legal Aid Online, Get Legal Help',
      orgName: 'Plataforma estatal de referencias', orgSub: 'Te dirige al abogado de ayuda legal correcto para tu caso',
      orgDesc: 'Responde unas preguntas e ILAO te conectará con un abogado de ayuda legal gratis cerca de ti. Manejan desalojos, reparaciones, depósitos de seguridad y más. Disponible en inglés y español.',
      websiteLabel: 'Sitio web', website: 'illinoislegalaid.org', phoneLabel: 'Teléfono', phone: '311 en Chicago',
      bringLabel: 'Lleva esto contigo', bring: ['Tu contrato de renta', 'Cualquier aviso que recibiste', 'Identificación con foto', 'Fotos de los problemas', 'Recibos de renta'],
      startBtn: 'Empieza con ILAO →', otherBtn: 'Ver otras organizaciones',
    },
  },

  zh: {
    parentLabel: '住房与租金',
    eyebrow: '住房与租金',
    title: '您作为伊利诺伊州租户的权利。',
    sub: '驱逐、租金上涨、押金、维修，以及房东违反规定时该怎么办。',
    quickNav: [
      { id: 'summary', label: '摘要' },
      { id: 'questions', label: '常见问题' },
      { id: 'programs', label: '规则与保护' },
      { id: 'action', label: '该做什么' },
      { id: 'help', label: '获取帮助' },
    ],
    summary: '在芝加哥，租户受《住宅房东与租户条例》(RLTO) 和《公平通知条例》的保护。这些规定涵盖房东在涨租或终止租约前必须提前多久通知您、押金该如何处理、房东必须做什么来保持您的住所适宜居住，以及如果他们违规您可以怎么做。在芝加哥以外，伊利诺伊州法律设定了最低标准，但提供的具体保护较少。',
    faqs: [
      { q: '房东涨租需要提前多久通知我？', a: '在芝加哥，如果您居住不到6个月，必须提前30天书面通知；居住6个月到3年的需提前60天；居住超过3年的需提前120天。在芝加哥以外，伊利诺伊州法律要求按月租约提前30天通知。', source: 'Chicago RLTO §5-12-130 and Chicago Fair Notice Ordinance' },
      { q: '房东没有退还我的押金。我能做什么？', a: '伊利诺伊州法律要求：如有逐项扣除，押金须在30天内退还；如无扣除，则须在45天内退还。如果房东未能做到，您可能有权获得押金金额的两倍，外加诉讼费和律师费。', source: 'Illinois Security Deposit Return Act' },
      { q: '我的公寓没有暖气。房东必须修吗？', a: '是的。在芝加哥，房东必须从9月15日到6月1日供暖，白天最低68度，夜间最低66度。如果房东不供暖，您可以拨打311、在某些情况下扣留租金，或起诉要求赔偿。', source: 'Chicago Municipal Code 5-12-110' },
      { q: '房东想驱逐我。这个过程需要多长时间？', a: '一般来说，伊利诺伊州的驱逐从头到尾需要30到90天。房东必须先给您书面通知（根据原因为5天、10天或30天），然后向法院提起诉讼，再由法官作出判决，之后治安官才能将您逐出。没有法院命令，不能把您锁在门外。', source: 'Illinois Eviction Act, 735 ILCS 5/9-101' },
    ],
    programs: [
      { name: 'Chicago Residential Landlord and Tenant Ordinance (RLTO)', amount: '芝加哥', meta: 'Chicago Municipal Code §5-12', body: 'RLTO 是保护芝加哥租户的主要法律。它涵盖押金、维修、供暖要求、房东进入规则、租约终止和租户救济。它适用于市内几乎所有出租单元，仅有少数例外，如房东自住的6个单元或以下的建筑。', cta: '阅读 RLTO', meta2: '适用于芝加哥大多数出租房' },
      { name: 'Chicago Fair Notice Ordinance', amount: '芝加哥', meta: 'Effective July 2020', body: '该条例要求房东在涨租或终止租约前，根据您居住时间的长短，提供更长的通知期。其目的是给租户更多时间，以便在无法承担涨租时寻找新住所。', cta: '了解更多', meta2: '30 / 60 / 120 天通知规则' },
      { name: 'Illinois Eviction Act', amount: '全州', meta: '735 ILCS 5/9', body: '这条州法律规定了驱逐必须如何进行。它要求房东在驱逐任何租户之前给予书面通知、向法院提起诉讼并获得判决。擅自驱逐（如换锁或切断公用事业）是非法的。', cta: '阅读法规', meta2: '整个伊利诺伊州' },
    ],
    steps: [
      { title: '把一切都用书面记录下来。', body: '拍照、保存短信，并记下任何对话的日期。保留房东给您的每一份通知的副本。' },
      { title: '自己发出书面通知。', body: '如果房东不进行维修，写一封注明日期的信（保留副本），描述问题并给他们合理的时间来修理。' },
      { title: '居住问题请拨打311。', body: '在芝加哥，311 可以派建筑检查员处理诸如无暖气、霉菌、虫害或不安全状况等问题。检查报告日后可以支持您的案件。' },
      { title: '不要在没有收据的情况下付现金。', body: '如果您必须用现金付租，务必索取有签名和日期的收据。这能在房东日后声称您未付款时保护您。' },
      { title: '在事态升级前获取免费法律帮助。', body: '不要等到上法庭才行动。一旦出现问题，尽快致电法律援助机构，让他们帮助您正确应对。' },
    ],
    referral: {
      sticker: '从这里开始', title: 'Illinois Legal Aid Online, Get Legal Help',
      orgName: '全州转介平台', orgSub: '为您的案件转介到合适的法律援助律师',
      orgDesc: '回答几个问题，ILAO 就会为您联系附近的免费法律援助律师。他们处理驱逐、维修、押金等问题。提供英语和西班牙语服务。',
      websiteLabel: '网站', website: 'illinoislegalaid.org', phoneLabel: '电话', phone: '芝加哥拨打 311',
      bringLabel: '请带上这些', bring: ['您的租约', '您收到的任何通知', '带照片的身份证件', '问题的照片', '租金收据'],
      startBtn: '从 ILAO 开始 →', otherBtn: '查看其他机构',
    },
  },

  tl: {
    parentLabel: 'Pabahay at upa',
    eyebrow: 'Pabahay at upa',
    title: 'Ang iyong mga karapatan bilang umuupa sa Illinois.',
    sub: 'Pagpapaalis, pagtaas ng upa, deposito, pag-aayos, at ang gagawin kung lumalabag ang iyong kasera.',
    quickNav: [
      { id: 'summary', label: 'Buod' },
      { id: 'questions', label: 'Karaniwang tanong' },
      { id: 'programs', label: 'Mga panuntunan at proteksyon' },
      { id: 'action', label: 'Ano ang gagawin' },
      { id: 'help', label: 'Humingi ng tulong' },
    ],
    summary: 'Sa Chicago, ang mga umuupa ay protektado ng Residential Landlord and Tenant Ordinance (RLTO) at ng Fair Notice Ordinance. Sinasaklaw ng mga panuntunang ito kung gaano katagal dapat magbigay ng abiso ang iyong kasera bago itaas ang upa o tapusin ang lease, paano dapat hawakan ang deposito, ano ang dapat gawin ng kasera para manatiling matitirhan ang iyong tahanan, at ang magagawa mo kung lumabag sila. Sa labas ng Chicago, nagtatakda ng pinakamababang pamantayan ang batas ng estado ng Illinois ngunit nag-aalok ng mas kaunting tiyak na proteksyon.',
    faqs: [
      { q: 'Gaano katagal na abiso ang kailangan ng kasera ko para itaas ang upa?', a: 'Sa Chicago, dapat magbigay ng nakasulat na abiso 30 araw nang maaga kung wala pang 6 na buwan kang nakatira, 60 araw kung 6 na buwan hanggang 3 taon, at 120 araw kung higit sa 3 taon. Sa labas ng Chicago, nangangailangan ang batas ng estado ng Illinois ng 30 araw na abiso para sa buwan-buwang pag-upa.', source: 'Chicago RLTO §5-12-130 and Chicago Fair Notice Ordinance' },
      { q: 'Hindi ibinalik ng kasera ko ang aking deposito. Ano ang magagawa ko?', a: 'Iniaatas ng batas ng Illinois na ibalik ang deposito sa loob ng 30 araw kung may nakalistang mga bawas, o 45 araw kung walang bawas. Kung hindi ito gawin ng kasera, maaari kang may karapatan sa doble ng halaga ng deposito kasama ang mga gastos sa korte at bayad sa abogado.', source: 'Illinois Security Deposit Return Act' },
      { q: 'Walang init sa aking apartment. Kailangan ba itong ayusin ng kasera ko?', a: 'Oo. Sa Chicago, dapat magbigay ng init ang mga kasera mula Setyembre 15 hanggang Hunyo 1, na may pinakamababang temperatura na 68 degrees sa araw at 66 degrees sa gabi. Kung hindi magbigay ng init ang iyong kasera, maaari kang tumawag sa 311, mag-withhold ng upa sa ilang kaso, o magdemanda para sa danyos.', source: 'Chicago Municipal Code 5-12-110' },
      { q: 'Gustong paalisin ako ng kasera ko. Gaano katagal ang proseso?', a: 'Sa pangkalahatan, ang pagpapaalis sa Illinois ay tumatagal ng 30 hanggang 90 araw mula simula hanggang dulo. Dapat munang magbigay ang kasera ng nakasulat na abiso (5, 10, o 30 araw depende sa dahilan), pagkatapos ay maghain ng kaso sa korte, at pagkatapos ay kumuha ng hatol mula sa hukom bago ka maaaring paalisin ng sheriff. Hindi ka maaaring i-lock out nang walang utos ng korte.', source: 'Illinois Eviction Act, 735 ILCS 5/9-101' },
    ],
    programs: [
      { name: 'Chicago Residential Landlord and Tenant Ordinance (RLTO)', amount: 'Chicago', meta: 'Chicago Municipal Code §5-12', body: 'Ang RLTO ang pangunahing batas na nagpoprotekta sa mga umuupa sa Chicago. Sinasaklaw nito ang deposito, pag-aayos, mga kinakailangan sa init, mga panuntunan sa pagpasok ng kasera, pagtatapos ng lease, at mga remedyo ng umuupa. Naaangkop ito sa halos lahat ng paupahang unit sa lungsod, may ilang eksepsiyon para sa mga gusaling tinitirhan ng may-ari na 6 na unit o mas kaunti.', cta: 'Basahin ang RLTO', meta2: 'Naaangkop sa karamihan ng paupahan sa Chicago' },
      { name: 'Chicago Fair Notice Ordinance', amount: 'Chicago', meta: 'Effective July 2020', body: 'Iniaatas ng ordinansang ito ang mas mahabang panahon ng abiso bago maitaas ng kasera ang upa o matapos ang lease, depende sa tagal ng iyong paninirahan. Layunin nitong bigyan ang mga umuupa ng mas maraming oras na makahanap ng bagong tirahan kung hindi nila kayang bayaran ang pagtaas.', cta: 'Matuto pa', meta2: 'Panuntunan ng abiso na 30 / 60 / 120 araw' },
      { name: 'Illinois Eviction Act', amount: 'Buong estado', meta: '735 ILCS 5/9', body: 'Pinamamahalaan ng batas ng estadong ito kung paano dapat magpatuloy ang pagpapaalis. Iniaatas nito sa mga kasera na magbigay ng nakasulat na abiso, maghain ng kaso sa korte, at kumuha ng hatol bago maaaring paalisin ang sinumang umuupa. Ilegal ang sariling pagpapaalis tulad ng pagpapalit ng kandado o pagputol ng mga utility.', cta: 'Basahin ang batas', meta2: 'Buong Illinois' },
    ],
    steps: [
      { title: 'Idokumento ang lahat nang nakasulat.', body: 'Kumuha ng litrato, i-save ang mga text message, at isulat ang mga petsa ng anumang pag-uusap. Magtago ng kopya ng bawat abisong ibinibigay ng iyong kasera.' },
      { title: 'Magpadala ka ng nakasulat na abiso.', body: 'Kung hindi inaayos ng kasera ang isang pagkukumpuni, sumulat ng liham na may petsa (magtago ng kopya) na naglalarawan ng problema at nagbibigay sa kanila ng makatwirang oras para ayusin ito.' },
      { title: 'Tumawag sa 311 para sa mga isyu sa pagkamatirahan.', body: 'Sa Chicago, maaaring magpadala ang 311 ng inspektor ng gusali para sa mga isyu tulad ng walang init, amag, peste, o hindi ligtas na kondisyon. Maaaring suportahan ng ulat ng inspeksyon ang iyong kaso sa bandang huli.' },
      { title: 'Huwag magbayad ng cash nang walang resibo.', body: 'Kung kailangan mong magbayad ng upa sa cash, laging kumuha ng pirmado at may-petsang resibo. Pinoprotektahan ka nito kung sasabihin ng kasera mo sa hinaharap na hindi ka nagbayad.' },
      { title: 'Humingi ng libreng tulong legal bago lumala.', body: 'Huwag maghintay hanggang nasa korte ka na. Tumawag sa organisasyon ng tulong legal sa sandaling magsimula ang problema para matulungan ka nilang tumugon nang tama.' },
    ],
    referral: {
      sticker: 'Magsimula dito', title: 'Illinois Legal Aid Online, Get Legal Help',
      orgName: 'Plataporma ng referral sa buong estado', orgSub: 'Itinuturo ka sa tamang abogado ng tulong legal para sa iyong kaso',
      orgDesc: 'Sumagot ng ilang tanong at ikokonekta ka ng ILAO sa libreng abogado ng tulong legal malapit sa iyo. Hinahawakan nila ang pagpapaalis, pag-aayos, deposito, at iba pa. Available sa Ingles at Espanyol.',
      websiteLabel: 'Website', website: 'illinoislegalaid.org', phoneLabel: 'Telepono', phone: '311 sa Chicago',
      bringLabel: 'Dalhin ang mga ito', bring: ['Ang iyong lease', 'Anumang abisong natanggap mo', 'ID na may litrato', 'Mga litrato ng problema', 'Mga resibo ng upa'],
      startBtn: 'Magsimula sa ILAO →', otherBtn: 'Tingnan ang ibang organisasyon',
    },
  },

  vi: {
    parentLabel: 'Nhà ở và tiền thuê',
    eyebrow: 'Nhà ở và tiền thuê',
    title: 'Quyền của bạn với tư cách là người thuê nhà ở Illinois.',
    sub: 'Trục xuất, tăng tiền thuê, tiền đặt cọc, sửa chữa, và việc cần làm nếu chủ nhà vi phạm quy định.',
    quickNav: [
      { id: 'summary', label: 'Tóm tắt' },
      { id: 'questions', label: 'Câu hỏi thường gặp' },
      { id: 'programs', label: 'Quy tắc và bảo vệ' },
      { id: 'action', label: 'Việc cần làm' },
      { id: 'help', label: 'Nhận trợ giúp' },
    ],
    summary: 'Tại Chicago, người thuê nhà được bảo vệ bởi Sắc lệnh Chủ nhà và Người thuê nhà (RLTO) và Sắc lệnh Thông báo Công bằng. Các quy định này bao gồm chủ nhà phải thông báo trước bao lâu trước khi tăng tiền thuê hoặc chấm dứt hợp đồng, tiền đặt cọc phải được xử lý ra sao, chủ nhà phải làm gì để giữ nhà bạn ở được, và bạn có thể làm gì nếu họ vi phạm. Bên ngoài Chicago, luật bang Illinois đặt ra tiêu chuẩn tối thiểu nhưng cung cấp ít bảo vệ cụ thể hơn.',
    faqs: [
      { q: 'Chủ nhà phải thông báo trước bao lâu để tăng tiền thuê?', a: 'Tại Chicago, phải thông báo bằng văn bản trước 30 ngày nếu bạn đã ở dưới 6 tháng, 60 ngày nếu từ 6 tháng đến 3 năm, và 120 ngày nếu hơn 3 năm. Bên ngoài Chicago, luật bang Illinois yêu cầu thông báo trước 30 ngày đối với hợp đồng thuê theo tháng.', source: 'Chicago RLTO §5-12-130 and Chicago Fair Notice Ordinance' },
      { q: 'Chủ nhà chưa trả lại tiền đặt cọc của tôi. Tôi có thể làm gì?', a: 'Luật Illinois yêu cầu trả lại tiền đặt cọc trong vòng 30 ngày nếu có các khoản khấu trừ được liệt kê, hoặc 45 ngày nếu không có khấu trừ. Nếu chủ nhà không làm vậy, bạn có thể có quyền nhận gấp đôi số tiền đặt cọc cộng với án phí và phí luật sư.', source: 'Illinois Security Deposit Return Act' },
      { q: 'Căn hộ của tôi không có sưởi. Chủ nhà có phải sửa không?', a: 'Có. Tại Chicago, chủ nhà phải cung cấp sưởi từ ngày 15 tháng 9 đến ngày 1 tháng 6, với nhiệt độ tối thiểu 68 độ vào ban ngày và 66 độ vào ban đêm. Nếu chủ nhà không cung cấp sưởi, bạn có thể gọi 311, giữ lại tiền thuê trong một số trường hợp, hoặc kiện đòi bồi thường.', source: 'Chicago Municipal Code 5-12-110' },
      { q: 'Chủ nhà muốn trục xuất tôi. Quá trình này mất bao lâu?', a: 'Nhìn chung, việc trục xuất ở Illinois mất từ 30 đến 90 ngày từ đầu đến cuối. Chủ nhà trước tiên phải đưa thông báo bằng văn bản cho bạn (5, 10 hoặc 30 ngày tùy lý do), sau đó nộp đơn ra tòa, rồi nhận phán quyết của thẩm phán trước khi cảnh sát trưởng có thể đưa bạn ra ngoài. Bạn không thể bị khóa cửa ngoài mà không có lệnh tòa.', source: 'Illinois Eviction Act, 735 ILCS 5/9-101' },
    ],
    programs: [
      { name: 'Chicago Residential Landlord and Tenant Ordinance (RLTO)', amount: 'Chicago', meta: 'Chicago Municipal Code §5-12', body: 'RLTO là luật chính bảo vệ người thuê nhà ở Chicago. Nó bao gồm tiền đặt cọc, sửa chữa, yêu cầu về sưởi, quy tắc chủ nhà vào nhà, chấm dứt hợp đồng, và các biện pháp khắc phục cho người thuê. Nó áp dụng cho hầu hết các đơn vị cho thuê trong thành phố, với một vài ngoại lệ cho các tòa nhà chủ sở hữu ở có 6 đơn vị trở xuống.', cta: 'Đọc RLTO', meta2: 'Áp dụng cho hầu hết nhà cho thuê ở Chicago' },
      { name: 'Chicago Fair Notice Ordinance', amount: 'Chicago', meta: 'Effective July 2020', body: 'Sắc lệnh này yêu cầu thời gian thông báo dài hơn trước khi chủ nhà có thể tăng tiền thuê hoặc chấm dứt hợp đồng, tùy theo thời gian bạn đã ở. Nó nhằm cho người thuê thêm thời gian tìm chỗ ở mới nếu họ không đủ khả năng trả mức tăng.', cta: 'Tìm hiểu thêm', meta2: 'Quy tắc thông báo 30 / 60 / 120 ngày' },
      { name: 'Illinois Eviction Act', amount: 'Toàn bang', meta: '735 ILCS 5/9', body: 'Luật bang này quy định việc trục xuất phải tiến hành ra sao. Nó yêu cầu chủ nhà đưa thông báo bằng văn bản, nộp đơn ra tòa, và nhận phán quyết trước khi bất kỳ người thuê nào có thể bị đưa ra ngoài. Việc tự ý trục xuất như đổi khóa hoặc cắt tiện ích là bất hợp pháp.', cta: 'Đọc luật', meta2: 'Toàn bộ Illinois' },
    ],
    steps: [
      { title: 'Ghi lại mọi thứ bằng văn bản.', body: 'Chụp ảnh, lưu tin nhắn, và ghi lại ngày của bất kỳ cuộc trò chuyện nào. Giữ bản sao của mọi thông báo chủ nhà đưa cho bạn.' },
      { title: 'Tự gửi thông báo bằng văn bản.', body: 'Nếu chủ nhà không sửa chữa, hãy viết một lá thư có ghi ngày (giữ một bản sao) mô tả vấn đề và cho họ thời gian hợp lý để sửa.' },
      { title: 'Gọi 311 cho các vấn đề về điều kiện ở.', body: 'Tại Chicago, 311 có thể cử thanh tra tòa nhà cho các vấn đề như không có sưởi, nấm mốc, sâu bọ, hoặc điều kiện không an toàn. Báo cáo thanh tra có thể hỗ trợ trường hợp của bạn sau này.' },
      { title: 'Đừng trả tiền mặt mà không có biên lai.', body: 'Nếu bạn phải trả tiền thuê bằng tiền mặt, luôn lấy biên lai có chữ ký và ngày. Điều này bảo vệ bạn nếu sau này chủ nhà nói bạn chưa trả.' },
      { title: 'Nhận trợ giúp pháp lý miễn phí trước khi mọi việc leo thang.', body: 'Đừng chờ đến khi ra tòa. Gọi cho một tổ chức trợ giúp pháp lý ngay khi vấn đề bắt đầu để họ giúp bạn phản hồi đúng cách.' },
    ],
    referral: {
      sticker: 'Bắt đầu ở đây', title: 'Illinois Legal Aid Online, Get Legal Help',
      orgName: 'Nền tảng giới thiệu toàn bang', orgSub: 'Hướng bạn đến đúng luật sư trợ giúp pháp lý cho trường hợp của bạn',
      orgDesc: 'Trả lời vài câu hỏi và ILAO sẽ kết nối bạn với một luật sư trợ giúp pháp lý miễn phí gần bạn. Họ xử lý trục xuất, sửa chữa, tiền đặt cọc, và hơn thế nữa. Có sẵn bằng tiếng Anh và tiếng Tây Ban Nha.',
      websiteLabel: 'Trang web', website: 'illinoislegalaid.org', phoneLabel: 'Điện thoại', phone: '311 ở Chicago',
      bringLabel: 'Mang theo những thứ này', bring: ['Hợp đồng thuê của bạn', 'Bất kỳ thông báo nào bạn nhận được', 'Giấy tờ tùy thân có ảnh', 'Ảnh chụp các vấn đề', 'Biên lai tiền thuê'],
      startBtn: 'Bắt đầu với ILAO →', otherBtn: 'Xem tổ chức khác',
    },
  },
}

export default function Housing() {
  const { language } = useLanguage()
  const c = CONTENT[language] ?? CONTENT.en

  return (
    <TopicPage
      parentLabel={c.parentLabel}
      eyebrow={c.eyebrow}
      title={c.title}
      sub={c.sub}
      iconName="home"
      accent="var(--burgundy)"
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
          <div className="org-badge" aria-hidden="true">IL</div>
          <div>
            <p className="serif org-name">{r.orgName}</p>
            <p className="org-sub">{r.orgSub}</p>
          </div>
        </div>
        <p className="org-desc">{r.orgDesc}</p>
      </div>
      <div className="org-stats">
        <div className="stat"><p className="stat-label">{r.websiteLabel}</p><p className="stat-val">{r.website}</p></div>
        <div className="stat"><p className="stat-label">{r.phoneLabel}</p><p className="stat-val">{r.phone}</p></div>
      </div>
      <p className="bring-label">{r.bringLabel}</p>
      <ul className="bring-list">
        {r.bring.map((item, i) => <li key={i} className="bring-chip">{item}</li>)}
      </ul>
      <div className="referral-buttons">
        <a href="https://illinoislegalaid.org" className="btn btn-clover external" target="_blank" rel="noopener" style={{ flex: 1, justifyContent: 'center' }}>
          {r.startBtn}
        </a>
        <a href="/resources" className="btn btn-outline" style={{ justifyContent: 'center' }}>{r.otherBtn}</a>
      </div>
    </aside>
  )
}
