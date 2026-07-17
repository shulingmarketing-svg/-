import type { Metadata } from 'next'
import { Inter, Noto_Sans_TC } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-noto',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://shulingmarketing-svg.github.io'),
  title: {
    default: '綾策 Ling Strategy | 品牌行銷顧問',
    template: '%s | 綾策 Ling Strategy',
  },
  description: '綾策 Ling Strategy — 幫助中小企業用品牌思維做行銷。廣告投放、社群經營、SEO 內容規劃，全台遠端合作。',
  openGraph: {
    siteName: '綾策 Ling Strategy',
    locale: 'zh_TW',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${notoSansTC.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter), var(--font-noto), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
