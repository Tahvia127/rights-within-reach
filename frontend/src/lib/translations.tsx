import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type Language = 'en' | 'es' | 'zh' | 'tl' | 'vi'

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'ENGLISH' },
  { code: 'es', label: 'ESPAÑOL' },
  { code: 'zh', label: '中文' },
  { code: 'tl', label: 'TAGALOG' },
  { code: 'vi', label: 'TIẾNG VIỆT' },
]

interface LanguageContextValue {
  language: Language
  setLanguage: (code: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

// UI strings for shared chrome and Chat screen. English is the source of truth
// and fallback. Non-English strings are machine-drafted, pending native review.
// zh/tl/vi cover core labels only; missing keys fall back to English.
const STRINGS: Record<Language, Record<string, string>> = {
  en: {
    'language.label': 'LANGUAGE',
    'skip.toMain': 'Skip to main content',
    'brand.homeAria': 'Rights Within Reach home',

    'nav.home': 'Home',
    'nav.topics': 'Topics',
    'nav.resources': 'Resources',
    'nav.askQuestion': 'Ask a question →',
    'nav.biggerText': 'Toggle larger text size',

    'bottomnav.housing': 'Housing',
    'bottomnav.money': 'Money',
    'bottomnav.repairs': 'Repairs',
    'bottomnav.benefits': 'Benefits',
    'bottomnav.resources': 'Resources',
    'bottomnav.ask': 'Ask',
    'bottomnav.aria': 'Section navigation',

    'chat.back': 'Back',
    'chat.goBack': 'Go back',
    'chat.readAloud': 'Read this page aloud',
    'chat.live': 'Live conversation',
    'chat.question': 'question so far',
    'chat.questions': 'questions so far',
    'chat.allCite': 'All answers cite the law',
    'chat.conversationAria': 'Conversation',
    'chat.tryNext': 'Try asking next',
    'chat.suggest1': 'What if the notice was late?',
    'chat.suggest2': 'How do I apply for SNAP?',
    'chat.suggest3': 'Are there grants to fix my roof?',
    'chat.placeholder': 'Type your question here…',
    'chat.typeQuestion': 'Type your question',
    'chat.send': 'Send your question',
    'chat.askAria': 'Ask a question',
    'chat.answered': '✓ Answered',
    'chat.searching': 'Searching the law for you…',
    'chat.error': 'Something went wrong. Please try again.',
    'chat.errorTitle': 'Something went wrong.',
    'chat.sources': '★ Sources',
    'chat.moreOptions': 'More options',
    'chat.callNow': 'Call now',
    'chat.refuseBody': 'This kind of case needs a lawyer who knows your full situation. I only cover housing, money, repairs, and benefits.',

    'footer.tagline': 'Free, plain-language legal information for Illinois residents. Built in Chicago with input from legal aid partners.',
    'footer.topics': 'Topics',
    'footer.help': 'Help',
    'footer.about': 'About',
    'footer.housingRent': 'Housing & Rent',
    'footer.moneyDebt': 'Money & Debt',
    'footer.homeRepairs': 'Home Repairs',
    'footer.publicBenefits': 'Public Benefits',
    'footer.askQuestion': 'Ask a question',
    'footer.findHelp': 'Find legal help',
    'footer.howToUse': 'How to use this site',
    'footer.whoWeAre': 'Who we are',
    'footer.ourPartners': 'Our partners',
    'footer.contact': 'Contact',
    'footer.disclaimer': '★ Rights Within Reach gives general legal information, not legal advice. ★ Built in Chicago at the University of Chicago Tech Showcase.',
  },

  es: {
    'language.label': 'IDIOMA',
    'skip.toMain': 'Saltar al contenido principal',
    'brand.homeAria': 'Inicio de Rights Within Reach',

    'nav.home': 'Inicio',
    'nav.topics': 'Temas',
    'nav.resources': 'Recursos',
    'nav.askQuestion': 'Haz una pregunta →',
    'nav.biggerText': 'Cambiar a texto más grande',

    'bottomnav.housing': 'Vivienda',
    'bottomnav.money': 'Dinero',
    'bottomnav.repairs': 'Reparaciones',
    'bottomnav.benefits': 'Beneficios',
    'bottomnav.resources': 'Recursos',
    'bottomnav.ask': 'Preguntar',
    'bottomnav.aria': 'Navegación de secciones',

    'chat.back': 'Atrás',
    'chat.goBack': 'Regresar',
    'chat.readAloud': 'Leer esta página en voz alta',
    'chat.live': 'Conversación en vivo',
    'chat.question': 'pregunta hasta ahora',
    'chat.questions': 'preguntas hasta ahora',
    'chat.allCite': 'Todas las respuestas citan la ley',
    'chat.conversationAria': 'Conversación',
    'chat.tryNext': 'Prueba a preguntar',
    'chat.suggest1': '¿Y si el aviso llegó tarde?',
    'chat.suggest2': '¿Cómo solicito SNAP?',
    'chat.suggest3': '¿Hay ayudas para arreglar mi techo?',
    'chat.placeholder': 'Escribe tu pregunta aquí…',
    'chat.typeQuestion': 'Escribe tu pregunta',
    'chat.send': 'Enviar tu pregunta',
    'chat.askAria': 'Haz una pregunta',
    'chat.answered': '✓ Respondido',
    'chat.searching': 'Buscando en la ley para ti…',
    'chat.error': 'Algo salió mal. Por favor, inténtalo de nuevo.',
    'chat.errorTitle': 'Algo salió mal.',
    'chat.sources': '★ Fuentes',
    'chat.moreOptions': 'Más opciones',
    'chat.callNow': 'Llamar ahora',
    'chat.refuseBody': 'Este tipo de caso necesita un abogado que conozca toda tu situación. Yo solo cubro vivienda, dinero, reparaciones y beneficios.',

    'footer.tagline': 'Información legal gratuita y en lenguaje sencillo para residentes de Illinois. Creado en Chicago con aportes de socios de asistencia legal.',
    'footer.topics': 'Temas',
    'footer.help': 'Ayuda',
    'footer.about': 'Acerca de',
    'footer.housingRent': 'Vivienda y renta',
    'footer.moneyDebt': 'Dinero y deudas',
    'footer.homeRepairs': 'Reparaciones del hogar',
    'footer.publicBenefits': 'Beneficios públicos',
    'footer.askQuestion': 'Haz una pregunta',
    'footer.findHelp': 'Buscar ayuda legal',
    'footer.howToUse': 'Cómo usar este sitio',
    'footer.whoWeAre': 'Quiénes somos',
    'footer.ourPartners': 'Nuestros socios',
    'footer.contact': 'Contacto',
    'footer.disclaimer': '★ Rights Within Reach ofrece información legal general, no asesoría legal. ★ Creado en Chicago en el Tech Showcase de la Universidad de Chicago.',
  },

  zh: {
    'language.label': '语言',
    'skip.toMain': '跳到主要内容',
    'nav.home': '主页',
    'nav.topics': '主题',
    'nav.resources': '资源',
    'nav.askQuestion': '提问 →',
    'nav.biggerText': '切换更大的文字',
    'bottomnav.housing': '住房',
    'bottomnav.money': '金钱',
    'bottomnav.repairs': '维修',
    'bottomnav.benefits': '福利',
    'bottomnav.resources': '资源',
    'bottomnav.ask': '提问',
    'chat.back': '返回',
    'chat.live': '实时对话',
    'chat.allCite': '所有回答都引用法律',
    'chat.placeholder': '在这里输入您的问题…',
    'chat.send': '发送您的问题',
    'chat.answered': '✓ 已回答',
    'chat.searching': '正在为您查找法律…',
    'chat.sources': '★ 来源',
    'chat.moreOptions': '更多选项',
    'chat.callNow': '立即致电',
    'footer.topics': '主题',
    'footer.help': '帮助',
    'footer.about': '关于',
    'footer.housingRent': '住房与租金',
    'footer.moneyDebt': '金钱与债务',
    'footer.homeRepairs': '房屋维修',
    'footer.publicBenefits': '公共福利',
    'footer.askQuestion': '提问',
    'footer.findHelp': '寻找法律帮助',
  },

  tl: {
    'language.label': 'WIKA',
    'skip.toMain': 'Lumaktaw sa pangunahing nilalaman',
    'nav.home': 'Tahanan',
    'nav.topics': 'Mga Paksa',
    'nav.resources': 'Mga Mapagkukunan',
    'nav.askQuestion': 'Magtanong →',
    'bottomnav.housing': 'Pabahay',
    'bottomnav.money': 'Pera',
    'bottomnav.repairs': 'Pag-aayos',
    'bottomnav.benefits': 'Mga Benepisyo',
    'bottomnav.resources': 'Mapagkukunan',
    'bottomnav.ask': 'Magtanong',
    'chat.back': 'Bumalik',
    'chat.live': 'Live na usapan',
    'chat.allCite': 'Lahat ng sagot ay sumisipi sa batas',
    'chat.placeholder': 'I-type ang iyong tanong dito…',
    'chat.send': 'Ipadala ang iyong tanong',
    'chat.answered': '✓ Nasagot',
    'chat.searching': 'Hinahanap ang batas para sa iyo…',
    'chat.sources': '★ Mga Pinagkunan',
    'chat.moreOptions': 'Higit pang opsyon',
    'chat.callNow': 'Tumawag ngayon',
    'footer.topics': 'Mga Paksa',
    'footer.help': 'Tulong',
    'footer.about': 'Tungkol',
    'footer.housingRent': 'Pabahay at Upa',
    'footer.moneyDebt': 'Pera at Utang',
    'footer.homeRepairs': 'Pag-aayos ng Bahay',
    'footer.publicBenefits': 'Pampublikong Benepisyo',
  },

  vi: {
    'language.label': 'NGÔN NGỮ',
    'skip.toMain': 'Bỏ qua đến nội dung chính',
    'nav.home': 'Trang chủ',
    'nav.topics': 'Chủ đề',
    'nav.resources': 'Tài nguyên',
    'nav.askQuestion': 'Đặt câu hỏi →',
    'bottomnav.housing': 'Nhà ở',
    'bottomnav.money': 'Tiền bạc',
    'bottomnav.repairs': 'Sửa chữa',
    'bottomnav.benefits': 'Phúc lợi',
    'bottomnav.resources': 'Tài nguyên',
    'bottomnav.ask': 'Hỏi',
    'chat.back': 'Quay lại',
    'chat.live': 'Cuộc trò chuyện trực tiếp',
    'chat.allCite': 'Mọi câu trả lời đều trích dẫn luật',
    'chat.placeholder': 'Nhập câu hỏi của bạn tại đây…',
    'chat.send': 'Gửi câu hỏi của bạn',
    'chat.answered': '✓ Đã trả lời',
    'chat.searching': 'Đang tìm luật cho bạn…',
    'chat.sources': '★ Nguồn',
    'chat.moreOptions': 'Thêm tùy chọn',
    'chat.callNow': 'Gọi ngay',
    'footer.topics': 'Chủ đề',
    'footer.help': 'Trợ giúp',
    'footer.about': 'Giới thiệu',
    'footer.housingRent': 'Nhà ở & Tiền thuê',
    'footer.moneyDebt': 'Tiền & Nợ',
    'footer.homeRepairs': 'Sửa chữa nhà',
    'footer.publicBenefits': 'Phúc lợi công',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  const setLanguage = (code: Language) => {
    setLanguageState(code)
    document.documentElement.lang = code
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t = (key: string): string => STRINGS[language]?.[key] ?? STRINGS.en[key] ?? key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}