export const COOKIE_NAME = 'language'
export const languages = ['vi', 'en'] as const
export type Language = (typeof languages)[number]
export const defaultLanguage: Language = 'vi'

