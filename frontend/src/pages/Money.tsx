import { TopicPage } from '../components/TopicPage'
import { useLanguage, Language } from '../lib/translations'

// Per-language content for the Money & Debt topic page. English is the source
// of truth; es/zh/tl/vi are machine-drafted and PENDING NATIVE-SPEAKER REVIEW.
// Law names and statute citations (name/source/meta) stay in English on purpose.

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

const CONTENT: Record<'en', TopicContent> & Partial<Record<Language, TopicContent>> = {
  en: {
    parentLabel: 'Money & Debt',
    eyebrow: 'Money & debt',
    title: 'Your rights with debt, wages, and utilities.',
    sub: 'Wage garnishment, debt collector harassment, utility shutoffs, predatory loans, and how to push back.',
    quickNav: [
      { id: 'summary', label: 'Summary' },
      { id: 'questions', label: 'Common questions' },
      { id: 'programs', label: 'Key laws' },
      { id: 'action', label: 'What to do' },
      { id: 'help', label: 'Get help' },
    ],
    summary: 'Many of the same crises that lead to eviction also lead to debt: medical bills, lost income, unpaid utilities. Illinois and federal law give consumers real protections against debt collector harassment, illegal wage garnishment, and predatory lending. Knowing these rules can prevent a financial crisis from becoming a housing crisis.',
    faqs: [
      { q: 'How much of my paycheck can be garnished in Illinois?', a: 'Illinois law limits wage garnishment to the lesser of 15% of your gross weekly wages, or the amount by which your weekly wages exceed 45 times the state minimum wage. Some types of income are fully exempt, including most public benefits.', source: 'Illinois Wage Deduction Act, 735 ILCS 5/12-803' },
      { q: 'Can my utility be shut off in winter?', a: 'Generally, no, if you meet certain conditions. Under Illinois Commerce Commission rules, gas and electric service cannot be disconnected between December 1 and March 31 for households who qualify, have applied for LIHEAP, or are seriously ill.', source: 'Illinois Commerce Commission 83 IAC 280' },
      { q: 'What is the most a payday lender can charge in Illinois?', a: 'Under the Illinois Predatory Loan Prevention Act, no consumer loan can carry an annual percentage rate over 36%. Loans that exceed this rate are illegal and unenforceable in Illinois.', source: 'Illinois Predatory Loan Prevention Act' },
      { q: 'A debt collector keeps calling. Are there limits?', a: 'Yes. Debt collectors cannot call before 8 a.m. or after 9 p.m. They cannot threaten you, use obscene language, or call your workplace after you tell them to stop. They must verify the debt in writing if you request it within 30 days.', source: 'Fair Debt Collection Practices Act, 15 USC §1692' },
    ],
    programs: [
      { name: 'Fair Debt Collection Practices Act (FDCPA)', amount: 'Federal', meta: '15 USC §1692', body: 'This federal law limits when and how debt collectors can contact you. It prohibits harassment, false statements, and unfair practices. You can sue for violations and recover damages plus attorney fees.', cta: 'Read the law', meta2: 'Applies in all 50 states' },
      { name: 'Illinois Wage Deduction Act', amount: 'Statewide', meta: '735 ILCS 5/12-803', body: 'Limits how much of your wages can be garnished and protects certain types of income entirely. Many public benefits like SNAP, SSI, and Social Security are fully exempt from garnishment.', cta: 'Read the law', meta2: 'Garnishment limits in Illinois' },
      { name: 'LIHEAP, Low Income Home Energy Assistance Program', amount: 'Up to $1,000+', meta: 'Federal/state program', body: 'LIHEAP helps low-income households pay heating and cooling bills. It can prevent utility shutoffs, restore service that was cut off, or pay for emergency repairs. Application opens annually in October.', cta: 'Apply for LIHEAP', meta2: 'Income-based eligibility' },
    ],
    steps: [
      { title: 'Demand verification in writing.', body: 'When a debt collector first contacts you, send a written request for verification within 30 days. They must pause collection until they provide proof.' },
      { title: 'Know what is exempt from garnishment.', body: 'Social Security, SSI, SNAP, and certain other benefits are exempt by law. Banks must protect 2 months of these deposits in your account.' },
      { title: 'Apply for LIHEAP early.', body: 'Funds are limited and run out. Apply as soon as the program opens, even if you are not yet behind on bills.' },
      { title: 'Set up a payment plan before shutoff.', body: 'Utility companies in Illinois are required to offer deferred payment plans if you ask. Calling before a shutoff notice arrives is much easier than after.' },
      { title: 'Talk to a free credit counselor.', body: 'Nonprofit credit counselors can review your debts and help you negotiate. Avoid for-profit debt settlement companies that charge fees up front.' },
    ],
    referral: {
      sticker: 'Start here', title: 'CARPLS, Free Legal Aid Hotline',
      orgName: 'Cook County legal hotline', orgSub: 'Free advice on debt, consumer issues, and more',
      orgDesc: 'Call to speak with a lawyer about debt collection, garnishment, or utility shutoffs. CARPLS handles thousands of consumer cases each year and can tell you whether a collector is breaking the law.',
      phoneLabel: 'Phone', phone: '312-738-9200', hoursLabel: 'Hours', hours: 'Mon to Fri, 9 to 4:30',
      bringLabel: 'Have these ready', bring: ['Account statements', 'Collection letters', 'A call log', 'Pay stubs'],
      callBtn: 'Call CARPLS →', otherBtn: 'See other orgs',
    },
  },

  es: {
    parentLabel: 'Dinero y deudas',
    eyebrow: 'Dinero y deudas',
    title: 'Tus derechos con deudas, salarios y servicios públicos.',
    sub: 'Embargo de salario, acoso de cobradores, cortes de servicios, préstamos abusivos y cómo defenderte.',
    quickNav: [
      { id: 'summary', label: 'Resumen' },
      { id: 'questions', label: 'Preguntas comunes' },
      { id: 'programs', label: 'Leyes clave' },
      { id: 'action', label: 'Qué hacer' },
      { id: 'help', label: 'Busca ayuda' },
    ],
    summary: 'Muchas de las mismas crisis que llevan al desalojo también llevan a las deudas: facturas médicas, pérdida de ingresos, servicios sin pagar. Las leyes de Illinois y federales dan a los consumidores protecciones reales contra el acoso de cobradores, el embargo ilegal de salario y los préstamos abusivos. Conocer estas reglas puede evitar que una crisis financiera se convierta en una crisis de vivienda.',
    faqs: [
      { q: '¿Cuánto de mi cheque pueden embargar en Illinois?', a: 'La ley de Illinois limita el embargo de salario al menor de estos dos: el 15% de tu salario bruto semanal, o la cantidad en que tu salario semanal excede 45 veces el salario mínimo estatal. Algunos tipos de ingresos están totalmente exentos, incluida la mayoría de los beneficios públicos.', source: 'Illinois Wage Deduction Act, 735 ILCS 5/12-803' },
      { q: '¿Pueden cortarme los servicios en invierno?', a: 'Generalmente no, si cumples ciertas condiciones. Bajo las reglas de la Comisión de Comercio de Illinois, el servicio de gas y electricidad no se puede cortar entre el 1 de diciembre y el 31 de marzo para los hogares que califican, que solicitaron LIHEAP o que tienen una enfermedad grave.', source: 'Illinois Commerce Commission 83 IAC 280' },
      { q: '¿Cuál es el máximo que puede cobrar un prestamista de día de pago en Illinois?', a: 'Bajo la Ley de Prevención de Préstamos Abusivos de Illinois, ningún préstamo al consumidor puede tener una tasa de porcentaje anual mayor al 36%. Los préstamos que exceden esta tasa son ilegales y no se pueden hacer cumplir en Illinois.', source: 'Illinois Predatory Loan Prevention Act' },
      { q: 'Un cobrador no deja de llamar. ¿Hay límites?', a: 'Sí. Los cobradores no pueden llamar antes de las 8 a.m. ni después de las 9 p.m. No pueden amenazarte, usar lenguaje obsceno, ni llamar a tu trabajo después de que les digas que paren. Deben verificar la deuda por escrito si lo pides dentro de 30 días.', source: 'Fair Debt Collection Practices Act, 15 USC §1692' },
    ],
    programs: [
      { name: 'Fair Debt Collection Practices Act (FDCPA)', amount: 'Federal', meta: '15 USC §1692', body: 'Esta ley federal limita cuándo y cómo te pueden contactar los cobradores. Prohíbe el acoso, las declaraciones falsas y las prácticas injustas. Puedes demandar por las violaciones y recuperar daños más honorarios de abogado.', cta: 'Leer la ley', meta2: 'Aplica en los 50 estados' },
      { name: 'Illinois Wage Deduction Act', amount: 'Estatal', meta: '735 ILCS 5/12-803', body: 'Limita cuánto de tu salario se puede embargar y protege ciertos tipos de ingresos por completo. Muchos beneficios públicos como SNAP, SSI y el Seguro Social están totalmente exentos del embargo.', cta: 'Leer la ley', meta2: 'Límites de embargo en Illinois' },
      { name: 'LIHEAP, Low Income Home Energy Assistance Program', amount: 'Hasta $1,000+', meta: 'Programa federal/estatal', body: 'LIHEAP ayuda a los hogares de bajos ingresos a pagar las facturas de calefacción y aire. Puede evitar cortes de servicio, restablecer un servicio cortado, o pagar reparaciones de emergencia. La solicitud abre cada año en octubre.', cta: 'Solicitar LIHEAP', meta2: 'Elegibilidad según ingresos' },
    ],
    steps: [
      { title: 'Exige verificación por escrito.', body: 'Cuando un cobrador te contacte por primera vez, envía una solicitud de verificación por escrito dentro de 30 días. Deben pausar el cobro hasta que den la prueba.' },
      { title: 'Conoce qué está exento del embargo.', body: 'El Seguro Social, SSI, SNAP y ciertos otros beneficios están exentos por ley. Los bancos deben proteger 2 meses de estos depósitos en tu cuenta.' },
      { title: 'Solicita LIHEAP temprano.', body: 'Los fondos son limitados y se acaban. Solicita en cuanto abra el programa, aunque todavía no estés atrasado en las facturas.' },
      { title: 'Haz un plan de pago antes del corte.', body: 'Las compañías de servicios en Illinois deben ofrecer planes de pago diferido si los pides. Llamar antes de que llegue un aviso de corte es mucho más fácil que después.' },
      { title: 'Habla con un consejero de crédito gratis.', body: 'Los consejeros de crédito sin fines de lucro pueden revisar tus deudas y ayudarte a negociar. Evita las empresas de liquidación de deudas con fines de lucro que cobran por adelantado.' },
    ],
    referral: {
      sticker: 'Empieza aquí', title: 'CARPLS, Free Legal Aid Hotline',
      orgName: 'Línea legal del Condado de Cook', orgSub: 'Consejo gratis sobre deudas, problemas del consumidor y más',
      orgDesc: 'Llama para hablar con un abogado sobre cobro de deudas, embargo o cortes de servicios. CARPLS maneja miles de casos de consumidores cada año y puede decirte si un cobrador está violando la ley.',
      phoneLabel: 'Teléfono', phone: '312-738-9200', hoursLabel: 'Horario', hours: 'Lun to Vie, 9 to 4:30',
      bringLabel: 'Ten esto a la mano', bring: ['Estados de cuenta', 'Cartas de cobro', 'Un registro de llamadas', 'Talones de pago'],
      callBtn: 'Llamar a CARPLS →', otherBtn: 'Ver otras organizaciones',
    },
  },

  zh: {
    parentLabel: '金钱与债务',
    eyebrow: '金钱与债务',
    title: '您在债务、工资和公用事业方面的权利。',
    sub: '工资扣押、催债骚扰、停水停电、掠夺性贷款，以及如何反击。',
    quickNav: [
      { id: 'summary', label: '摘要' },
      { id: 'questions', label: '常见问题' },
      { id: 'programs', label: '主要法律' },
      { id: 'action', label: '该做什么' },
      { id: 'help', label: '获取帮助' },
    ],
    summary: '许多导致驱逐的危机也会导致债务：医疗账单、收入损失、未付的公用事业费。伊利诺伊州和联邦法律为消费者提供切实的保护，防止催债骚扰、非法工资扣押和掠夺性贷款。了解这些规则可以防止财务危机演变成住房危机。',
    faqs: [
      { q: '在伊利诺伊州，我的工资最多可被扣押多少？', a: '伊利诺伊州法律将工资扣押限制为以下两者中较小的金额：您每周总工资的15%，或您每周工资超过州最低工资45倍的部分。某些类型的收入完全豁免，包括大多数公共福利。', source: 'Illinois Wage Deduction Act, 735 ILCS 5/12-803' },
      { q: '冬天我的公用事业会被切断吗？', a: '一般来说不会，如果您符合某些条件。根据伊利诺伊州商业委员会的规定，对于符合条件、已申请 LIHEAP 或患有重病的家庭，燃气和电力服务在12月1日至3月31日之间不能被切断。', source: 'Illinois Commerce Commission 83 IAC 280' },
      { q: '在伊利诺伊州，发薪日贷款机构最多能收多少？', a: '根据《伊利诺伊州掠夺性贷款防范法》，任何消费贷款的年百分率不得超过36%。超过此利率的贷款在伊利诺伊州是非法的，且无法强制执行。', source: 'Illinois Predatory Loan Prevention Act' },
      { q: '催债人不停地打电话。有限制吗？', a: '有。催债人不能在早上8点之前或晚上9点之后打电话。他们不能威胁您、使用污言秽语，或在您告知停止后致电您的工作单位。如果您在30天内提出要求，他们必须以书面形式核实债务。', source: 'Fair Debt Collection Practices Act, 15 USC §1692' },
    ],
    programs: [
      { name: 'Fair Debt Collection Practices Act (FDCPA)', amount: '联邦', meta: '15 USC §1692', body: '这条联邦法律限制催债人何时以及如何联系您。它禁止骚扰、虚假陈述和不公平做法。您可以就违规行为提起诉讼，并追回赔偿金加律师费。', cta: '阅读法律', meta2: '适用于所有50个州' },
      { name: 'Illinois Wage Deduction Act', amount: '全州', meta: '735 ILCS 5/12-803', body: '限制您工资可被扣押的金额，并完全保护某些类型的收入。许多公共福利，如 SNAP、SSI 和社会保障，完全免于扣押。', cta: '阅读法律', meta2: '伊利诺伊州的扣押限额' },
      { name: 'LIHEAP, Low Income Home Energy Assistance Program', amount: '最高 $1,000+', meta: '联邦/州项目', body: 'LIHEAP 帮助低收入家庭支付取暖和制冷费用。它可以防止停水停电、恢复被切断的服务，或支付紧急维修费用。申请每年10月开放。', cta: '申请 LIHEAP', meta2: '按收入决定资格' },
    ],
    steps: [
      { title: '要求书面核实。', body: '催债人第一次联系您时，在30天内发送书面核实请求。在他们提供证明之前，必须暂停催收。' },
      { title: '了解哪些收入免于扣押。', body: '社会保障、SSI、SNAP 和某些其他福利依法豁免。银行必须保护您账户中这些存款的2个月金额。' },
      { title: '尽早申请 LIHEAP。', body: '资金有限且会用完。一旦项目开放就申请，即使您还没有拖欠账单。' },
      { title: '在停供前设立付款计划。', body: '伊利诺伊州的公用事业公司在您提出要求时必须提供延期付款计划。在停供通知到来之前打电话比之后容易得多。' },
      { title: '与免费信用顾问交谈。', body: '非营利信用顾问可以审查您的债务并帮助您协商。避免那些预先收费的营利性债务和解公司。' },
    ],
    referral: {
      sticker: '从这里开始', title: 'CARPLS, Free Legal Aid Hotline',
      orgName: '库克县法律热线', orgSub: '关于债务、消费者问题等的免费咨询',
      orgDesc: '致电与律师讨论债务催收、工资扣押或停水停电问题。CARPLS 每年处理数千起消费者案件，可以告诉您催债人是否违法。',
      phoneLabel: '电话', phone: '312-738-9200', hoursLabel: '时间', hours: '周一至周五, 9 to 4:30',
      bringLabel: '请准备好这些', bring: ['账户对账单', '催收信件', '通话记录', '工资单'],
      callBtn: '致电 CARPLS →', otherBtn: '查看其他机构',
    },
  },

  tl: {
    parentLabel: 'Pera at utang',
    eyebrow: 'Pera at utang',
    title: 'Ang iyong mga karapatan sa utang, sahod, at mga utility.',
    sub: 'Garnishment ng sahod, panghaharass ng maniningil, pagputol ng utility, mapanlinlang na pautang, at paano lumaban.',
    quickNav: [
      { id: 'summary', label: 'Buod' },
      { id: 'questions', label: 'Karaniwang tanong' },
      { id: 'programs', label: 'Mahahalagang batas' },
      { id: 'action', label: 'Ano ang gagawin' },
      { id: 'help', label: 'Humingi ng tulong' },
    ],
    summary: 'Marami sa mga krisis na humahantong sa pagpapaalis ay humahantong din sa utang: mga bayarin sa ospital, nawalang kita, hindi nabayarang utility. Ang mga batas ng Illinois at pederal ay nagbibigay sa mga mamimili ng tunay na proteksyon laban sa panghaharass ng maniningil, ilegal na garnishment ng sahod, at mapanlinlang na pagpapautang. Ang pag-alam sa mga panuntunang ito ay maaaring makaiwas na maging krisis sa pabahay ang isang krisis sa pananalapi.',
    faqs: [
      { q: 'Magkano sa aking sahod ang maaaring i-garnish sa Illinois?', a: 'Nililimitahan ng batas ng Illinois ang garnishment ng sahod sa mas mababa sa dalawa: 15% ng iyong gross na lingguhang sahod, o ang halagang lumalampas ang iyong lingguhang sahod sa 45 beses ng minimum wage ng estado. Ang ilang uri ng kita ay ganap na exempt, kabilang ang karamihan ng pampublikong benepisyo.', source: 'Illinois Wage Deduction Act, 735 ILCS 5/12-803' },
      { q: 'Maaari bang putulin ang aking utility sa taglamig?', a: 'Sa pangkalahatan, hindi, kung natutugunan mo ang ilang kondisyon. Sa ilalim ng mga panuntunan ng Illinois Commerce Commission, hindi maaaring putulin ang serbisyo ng gas at kuryente sa pagitan ng Disyembre 1 at Marso 31 para sa mga sambahayang kwalipikado, nag-apply ng LIHEAP, o malubhang may sakit.', source: 'Illinois Commerce Commission 83 IAC 280' },
      { q: 'Ano ang pinakamataas na maaaring singilin ng isang payday lender sa Illinois?', a: 'Sa ilalim ng Illinois Predatory Loan Prevention Act, walang utang sa mamimili ang maaaring magkaroon ng taunang porsyento ng rate na higit sa 36%. Ang mga pautang na lumalampas sa rate na ito ay ilegal at hindi maipapatupad sa Illinois.', source: 'Illinois Predatory Loan Prevention Act' },
      { q: 'Patuloy na tumatawag ang isang maniningil. May mga limitasyon ba?', a: 'Oo. Hindi maaaring tumawag ang mga maniningil bago mag-8 a.m. o pagkatapos ng 9 p.m. Hindi ka nila maaaring banta-an, gumamit ng malaswang salita, o tumawag sa iyong trabaho pagkatapos mong sabihing tumigil. Dapat nilang i-verify ang utang nang nakasulat kung hihilingin mo sa loob ng 30 araw.', source: 'Fair Debt Collection Practices Act, 15 USC §1692' },
    ],
    programs: [
      { name: 'Fair Debt Collection Practices Act (FDCPA)', amount: 'Pederal', meta: '15 USC §1692', body: 'Nililimitahan ng pederal na batas na ito kung kailan at paano ka maaaring kontakin ng mga maniningil. Ipinagbabawal nito ang panghaharass, maling pahayag, at hindi patas na mga gawi. Maaari kang magdemanda para sa mga paglabag at mabawi ang danyos kasama ang bayad sa abogado.', cta: 'Basahin ang batas', meta2: 'Naaangkop sa lahat ng 50 estado' },
      { name: 'Illinois Wage Deduction Act', amount: 'Buong estado', meta: '735 ILCS 5/12-803', body: 'Nililimitahan kung magkano sa iyong sahod ang maaaring i-garnish at ganap na pinoprotektahan ang ilang uri ng kita. Maraming pampublikong benepisyo tulad ng SNAP, SSI, at Social Security ay ganap na exempt sa garnishment.', cta: 'Basahin ang batas', meta2: 'Mga limitasyon sa garnishment sa Illinois' },
      { name: 'LIHEAP, Low Income Home Energy Assistance Program', amount: 'Hanggang $1,000+', meta: 'Programa ng pederal/estado', body: 'Tumutulong ang LIHEAP sa mga sambahayang may mababang kita na magbayad ng mga bayarin sa pampainit at pampalamig. Maaari nitong maiwasan ang pagputol ng utility, maibalik ang serbisyong pinutol, o mabayaran ang emergency na pag-aayos. Bumubukas ang aplikasyon kada Oktubre.', cta: 'Mag-apply sa LIHEAP', meta2: 'Pagiging karapat-dapat batay sa kita' },
    ],
    steps: [
      { title: 'Humingi ng verification nang nakasulat.', body: 'Kapag unang kinontak ka ng maniningil, magpadala ng nakasulat na kahilingan para sa verification sa loob ng 30 araw. Dapat nilang ihinto ang pangongolekta hanggang magbigay sila ng patunay.' },
      { title: 'Alamin kung ano ang exempt sa garnishment.', body: 'Ang Social Security, SSI, SNAP, at ilang iba pang benepisyo ay exempt ayon sa batas. Dapat protektahan ng mga bangko ang 2 buwan ng mga depositong ito sa iyong account.' },
      { title: 'Mag-apply sa LIHEAP nang maaga.', body: 'Limitado ang pondo at nauubos. Mag-apply sa sandaling bumukas ang programa, kahit hindi ka pa atrasado sa mga bayarin.' },
      { title: 'Mag-set up ng payment plan bago ang pagputol.', body: 'Kinakailangan ng mga kompanya ng utility sa Illinois na mag-alok ng deferred payment plan kung hihilingin mo. Mas madaling tumawag bago dumating ang abiso ng pagputol kaysa pagkatapos.' },
      { title: 'Kausapin ang isang libreng credit counselor.', body: 'Maaaring suriin ng mga nonprofit na credit counselor ang iyong mga utang at tulungan kang makipag-negosasyon. Iwasan ang mga for-profit na kompanya ng debt settlement na naniningil nang paunang bayad.' },
    ],
    referral: {
      sticker: 'Magsimula dito', title: 'CARPLS, Free Legal Aid Hotline',
      orgName: 'Legal hotline ng Cook County', orgSub: 'Libreng payo sa utang, mga isyu ng mamimili, at iba pa',
      orgDesc: 'Tumawag para makausap ang isang abogado tungkol sa pangongolekta ng utang, garnishment, o pagputol ng utility. Humahawak ang CARPLS ng libu-libong kaso ng mamimili kada taon at masasabi nila kung lumalabag sa batas ang isang maniningil.',
      phoneLabel: 'Telepono', phone: '312-738-9200', hoursLabel: 'Oras', hours: 'Lun to Biy, 9 to 4:30',
      bringLabel: 'Ihanda ang mga ito', bring: ['Mga account statement', 'Mga sulat ng pangongolekta', 'Isang log ng tawag', 'Mga pay stub'],
      callBtn: 'Tawagan ang CARPLS →', otherBtn: 'Tingnan ang ibang organisasyon',
    },
  },

  vi: {
    parentLabel: 'Tiền và nợ',
    eyebrow: 'Tiền và nợ',
    title: 'Quyền của bạn về nợ, tiền lương và tiện ích.',
    sub: 'Khấu trừ lương, người đòi nợ quấy rối, cắt tiện ích, vay nặng lãi, và cách phản kháng.',
    quickNav: [
      { id: 'summary', label: 'Tóm tắt' },
      { id: 'questions', label: 'Câu hỏi thường gặp' },
      { id: 'programs', label: 'Luật chính' },
      { id: 'action', label: 'Việc cần làm' },
      { id: 'help', label: 'Nhận trợ giúp' },
    ],
    summary: 'Nhiều cuộc khủng hoảng dẫn đến trục xuất cũng dẫn đến nợ: hóa đơn y tế, mất thu nhập, tiện ích chưa thanh toán. Luật Illinois và liên bang cho người tiêu dùng sự bảo vệ thực sự chống lại việc người đòi nợ quấy rối, khấu trừ lương bất hợp pháp, và cho vay nặng lãi. Biết các quy định này có thể ngăn một cuộc khủng hoảng tài chính trở thành khủng hoảng nhà ở.',
    faqs: [
      { q: 'Tại Illinois, tiền lương của tôi có thể bị khấu trừ bao nhiêu?', a: 'Luật Illinois giới hạn việc khấu trừ lương ở mức thấp hơn trong hai mức: 15% tổng lương tuần của bạn, hoặc phần lương tuần vượt quá 45 lần mức lương tối thiểu của bang. Một số loại thu nhập được miễn hoàn toàn, bao gồm hầu hết các phúc lợi công.', source: 'Illinois Wage Deduction Act, 735 ILCS 5/12-803' },
      { q: 'Tiện ích của tôi có thể bị cắt vào mùa đông không?', a: 'Nhìn chung là không, nếu bạn đáp ứng một số điều kiện. Theo quy định của Ủy ban Thương mại Illinois, dịch vụ gas và điện không thể bị cắt từ ngày 1 tháng 12 đến ngày 31 tháng 3 đối với các hộ gia đình đủ điều kiện, đã nộp đơn LIHEAP, hoặc bị bệnh nặng.', source: 'Illinois Commerce Commission 83 IAC 280' },
      { q: 'Tại Illinois, một nơi cho vay ngày lương có thể tính tối đa bao nhiêu?', a: 'Theo Đạo luật Ngăn ngừa Cho vay Nặng lãi của Illinois, không khoản vay tiêu dùng nào được có lãi suất phần trăm hằng năm trên 36%. Các khoản vay vượt mức này là bất hợp pháp và không thể thi hành ở Illinois.', source: 'Illinois Predatory Loan Prevention Act' },
      { q: 'Một người đòi nợ cứ gọi điện. Có giới hạn không?', a: 'Có. Người đòi nợ không được gọi trước 8 giờ sáng hoặc sau 9 giờ tối. Họ không được đe dọa bạn, dùng lời lẽ tục tĩu, hoặc gọi đến nơi làm việc của bạn sau khi bạn yêu cầu họ dừng. Họ phải xác minh khoản nợ bằng văn bản nếu bạn yêu cầu trong vòng 30 ngày.', source: 'Fair Debt Collection Practices Act, 15 USC §1692' },
    ],
    programs: [
      { name: 'Fair Debt Collection Practices Act (FDCPA)', amount: 'Liên bang', meta: '15 USC §1692', body: 'Luật liên bang này giới hạn khi nào và cách người đòi nợ có thể liên hệ bạn. Nó cấm quấy rối, tuyên bố sai sự thật, và các hành vi bất công. Bạn có thể kiện về các vi phạm và đòi bồi thường cộng phí luật sư.', cta: 'Đọc luật', meta2: 'Áp dụng ở tất cả 50 bang' },
      { name: 'Illinois Wage Deduction Act', amount: 'Toàn bang', meta: '735 ILCS 5/12-803', body: 'Giới hạn số tiền lương có thể bị khấu trừ và bảo vệ hoàn toàn một số loại thu nhập. Nhiều phúc lợi công như SNAP, SSI, và An sinh Xã hội được miễn hoàn toàn khỏi việc khấu trừ.', cta: 'Đọc luật', meta2: 'Giới hạn khấu trừ ở Illinois' },
      { name: 'LIHEAP, Low Income Home Energy Assistance Program', amount: 'Lên đến $1,000+', meta: 'Chương trình liên bang/bang', body: 'LIHEAP giúp các hộ thu nhập thấp trả hóa đơn sưởi và làm mát. Nó có thể ngăn việc cắt tiện ích, khôi phục dịch vụ đã bị cắt, hoặc trả cho sửa chữa khẩn cấp. Đơn đăng ký mở hằng năm vào tháng 10.', cta: 'Đăng ký LIHEAP', meta2: 'Điều kiện theo thu nhập' },
    ],
    steps: [
      { title: 'Yêu cầu xác minh bằng văn bản.', body: 'Khi người đòi nợ liên hệ bạn lần đầu, hãy gửi yêu cầu xác minh bằng văn bản trong vòng 30 ngày. Họ phải tạm dừng đòi nợ cho đến khi cung cấp bằng chứng.' },
      { title: 'Biết thu nhập nào được miễn khấu trừ.', body: 'An sinh Xã hội, SSI, SNAP, và một số phúc lợi khác được miễn theo luật. Ngân hàng phải bảo vệ 2 tháng các khoản tiền gửi này trong tài khoản của bạn.' },
      { title: 'Đăng ký LIHEAP sớm.', body: 'Quỹ có hạn và sẽ hết. Hãy đăng ký ngay khi chương trình mở, ngay cả khi bạn chưa trễ hóa đơn.' },
      { title: 'Lập kế hoạch trả tiền trước khi bị cắt.', body: 'Các công ty tiện ích ở Illinois bắt buộc phải cung cấp kế hoạch trả chậm nếu bạn yêu cầu. Gọi trước khi có thông báo cắt dễ hơn nhiều so với sau đó.' },
      { title: 'Nói chuyện với một cố vấn tín dụng miễn phí.', body: 'Các cố vấn tín dụng phi lợi nhuận có thể xem xét các khoản nợ của bạn và giúp bạn thương lượng. Tránh các công ty dàn xếp nợ vì lợi nhuận tính phí trả trước.' },
    ],
    referral: {
      sticker: 'Bắt đầu ở đây', title: 'CARPLS, Free Legal Aid Hotline',
      orgName: 'Đường dây pháp lý Quận Cook', orgSub: 'Tư vấn miễn phí về nợ, vấn đề người tiêu dùng, và hơn thế nữa',
      orgDesc: 'Gọi để nói chuyện với luật sư về việc đòi nợ, khấu trừ lương, hoặc cắt tiện ích. CARPLS xử lý hàng nghìn vụ người tiêu dùng mỗi năm và có thể cho bạn biết liệu một người đòi nợ có đang vi phạm luật hay không.',
      phoneLabel: 'Điện thoại', phone: '312-738-9200', hoursLabel: 'Giờ', hours: 'Thứ 2 to Thứ 6, 9 to 4:30',
      bringLabel: 'Chuẩn bị sẵn những thứ này', bring: ['Sao kê tài khoản', 'Thư đòi nợ', 'Nhật ký cuộc gọi', 'Phiếu lương'],
      callBtn: 'Gọi CARPLS →', otherBtn: 'Xem tổ chức khác',
    },
  },
}

export default function Money() {
  const { language } = useLanguage()
  const c = CONTENT[language] ?? CONTENT.en

  return (
    <TopicPage
      parentLabel={c.parentLabel}
      eyebrow={c.eyebrow}
      title={c.title}
      sub={c.sub}
      iconName="money"
      accent="var(--clover)"
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
          <div className="org-badge" aria-hidden="true">CP</div>
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
