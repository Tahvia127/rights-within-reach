import { SVGProps } from 'react'

import Bank from '../assets/icons/bank.svg?react'
import Benefits from '../assets/icons/benefits.svg?react'
import BookReading from '../assets/icons/book-reading.svg?react'
import Book from '../assets/icons/book.svg?react'
import Calendar from '../assets/icons/calendar.svg?react'
import Chat from '../assets/icons/chat.svg?react'
import Check from '../assets/icons/check.svg?react'
import Clock from '../assets/icons/clock.svg?react'
import Fist from '../assets/icons/fist.svg?react'
import Home from '../assets/icons/home.svg?react'
import Language from '../assets/icons/language.svg?react'
import Like from '../assets/icons/like.svg?react'
import MoneyBag from '../assets/icons/money-bag.svg?react'
import Money from '../assets/icons/money.svg?react'
import PhoneRinging from '../assets/icons/phone-ringing.svg?react'
import Phone from '../assets/icons/phone.svg?react'
import Send from '../assets/icons/send.svg?react'
import Settings from '../assets/icons/settings.svg?react'
import Support from '../assets/icons/support.svg?react'
import Task from '../assets/icons/task.svg?react'
import User from '../assets/icons/user.svg?react'
import Volume from '../assets/icons/volume.svg?react'
import Warning from '../assets/icons/warning.svg?react'
import Wrench from '../assets/icons/wrench.svg?react'

const REGISTRY = {
  bank: Bank,
  benefits: Benefits,
  'book-reading': BookReading,
  book: Book,
  calendar: Calendar,
  chat: Chat,
  check: Check,
  clock: Clock,
  fist: Fist,
  home: Home,
  language: Language,
  like: Like,
  'money-bag': MoneyBag,
  money: Money,
  'phone-ringing': PhoneRinging,
  phone: Phone,
  send: Send,
  settings: Settings,
  support: Support,
  task: Task,
  user: User,
  volume: Volume,
  warning: Warning,
  wrench: Wrench,
} as const

export type IconName = keyof typeof REGISTRY

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

// Renders a Streamline Core Line icon. Icons inherit text color via currentColor.
export function Icon({ name, size = 22, ...props }: IconProps) {
  const Component = REGISTRY[name]
  if (!Component) {
    console.warn(`Icon "${name}" not found in registry`)
    return null
  }
  return <Component width={size} height={size} aria-hidden="true" {...props} />
}