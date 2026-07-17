import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

/* ─────────────────────────────────────────
   Static Metadata — SSG-friendly (generated
   at build time, no runtime fetch needed)
───────────────────────────────────────── */
export const metadata: Metadata = {
  title: '關於芓綾',
  description:
    '芓綾是一位專注於品牌策略、廣告投放與 SEO 內容規劃的行銷顧問，幫助中小企業找到屬於自己的品牌聲音，全台遠端合作。',
  alternates: {
    canonical: 'https://shulingmarketing-svg.github.io/-/about/',
  },
  openGraph: {
    title: '關於芓綾 | 綾策 Ling Strategy',
    description: '品牌策略 × 廣告投放 × SEO 內容規劃 — 幫助中小企業用品牌思維做行銷。',
    url: 'https://shulingmarketing-svg.github.io/-/about/',
    images: [{ url: '/profile.JPG', width: 800, height: 1067, alt: '芓綾 — 品牌行銷顧問' }],
  },
}

/* ─────────────────────────────────────────
   LocalBusiness JSON-LD
   Schema: https://schema.org/LocalBusiness
   Embedded as a static <script> tag —
   crawlers see it on first HTML response,
   no JS execution needed.
───────────────────────────────────────── */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://shulingmarketing-svg.github.io/-/#business',
  name: '綾策 Ling Strategy',
  alternateName: 'Ling Strategy',
  description: '品牌策略、廣告投放、SEO 內容規劃，幫助台灣中小企業用品牌思維做行銷的顧問服務。',
  url: 'https://shulingmarketing-svg.github.io/-/',
  logo: 'https://shulingmarketing-svg.github.io/-/avatar.jpg',
  image: 'https://shulingmarketing-svg.github.io/-/profile.JPG',
  email: 'sling0309@gmail.com',
  areaServed: {
    '@type': 'Country',
    name: 'Taiwan',
  },
  serviceType: [
    '品牌策略建立',
    '廣告投放顧問',
    '社群媒體經營',
    'SEO 內容規劃',
    '行銷企劃書',
    'AI 工具導入',
  ],
  priceRange: '$$',
  currenciesAccepted: 'TWD',
  paymentAccepted: '銀行轉帳, LINE Pay',
  openingHours: 'Mo-Fr 10:00-18:00',
  founder: {
    '@type': 'Person',
    name: '芓綾',
    jobTitle: '品牌行銷顧問',
    description: '網路行銷自學實踐者，專注於品牌策略、廣告投放與 SEO 內容規劃。',
    image: 'https://shulingmarketing-svg.github.io/-/profile.JPG',
    sameAs: [],
  },
  knowsAbout: [
    'Brand Strategy',
    'Digital Marketing',
    'Social Media Marketing',
    'Search Engine Optimization',
    'Facebook Advertising',
    'Content Marketing',
    'AI Tools for Marketing',
  ],
}

/* ─────────────────────────────────────────
   Page Component (Server Component — SSG)
───────────────────────────────────────── */
export default function AboutPage() {
  return (
    <>
      {/* Inject JSON-LD into <head> via inline script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAV */}
      <nav style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(16px)' }}>
        <Link className="nav-logo" href="/">綾策 <span>Ling Strategy</span></Link>
        <ul className="nav-links" style={{ ['--link-color' as string]: 'rgba(255,255,255,0.8)' }}>
          <li><Link href="/#services" style={{ color: 'rgba(255,255,255,0.8)' }}>服務項目</Link></li>
          <li><Link href="/#articles" style={{ color: 'rgba(255,255,255,0.8)' }}>文章</Link></li>
          <li><Link href="/about/" style={{ color: '#a5b4fc', fontWeight: 700 }}>關於我</Link></li>
          <li><Link href="/#contact" style={{ color: 'rgba(255,255,255,0.8)' }}>聯絡我</Link></li>
        </ul>
        <Link className="nav-cta" href="/#contact">合作洽詢</Link>
      </nav>

      {/* PAGE HERO */}
      <header className="about-page-hero">
        <div className="hero-bg-glow hero-bg-glow-1" />
        <div className="hero-bg-glow hero-bg-glow-2" />
        <div className="about-page-hero-inner">
          <p style={{ color: '#a5b4fc', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            ── 關於我
          </p>
          <h1 className="about-page-title">
            用<span className="highlight">品牌思維</span>，<br />
            做真正有效的行銷
          </h1>
          <p className="about-page-desc">
            我是芓綾，一個在網路行銷這條路上持續自學、持續前進的實踐者。<br />
            品牌策略 × 廣告投放 × SEO 內容規劃，全台遠端合作。
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>
        <section style={{ background: 'var(--navy)', padding: '0 6% 110px' }}>
          <div className="section-inner">
            <div className="about-full-grid">

              {/* LEFT — sticky profile card */}
              <aside className="about-sticky" aria-label="個人資料">
                <div className="about-profile-card">
                  <div className="about-profile-img">
                    <Image
                      src="/profile.JPG"
                      alt="芓綾 — 品牌行銷顧問"
                      width={400}
                      height={500}
                      style={{ objectFit: 'cover', objectPosition: 'top', width: '100%', height: '100%' }}
                      priority
                    />
                  </div>
                  <div className="about-profile-name">芓綾</div>
                  <div className="about-profile-role">網路行銷 × 品牌策略顧問</div>
                  <div className="about-profile-tags">
                    {['品牌策略','FB 廣告','SEO','社群經營','AI 工具','行銷企劃'].map(t => (
                      <span key={t} className="hero-tag-item">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="about-social-links">
                  <Link href="/#contact" className="about-social-link">
                    <span>✉️</span> 合作洽詢
                  </Link>
                  <Link href="/#articles" className="about-social-link">
                    <span>📝</span> 閱讀文章
                  </Link>
                </div>
              </aside>

              {/* RIGHT — content */}
              <article className="about-content-col">

                <div className="about-content-block">
                  <h2>我是誰</h2>
                  <p>
                    一個在網路行銷這條路上持續自學、持續前進的實踐者。目前主要負責廣告投放、SEO 內容規劃與社群平台的日常經營，同時接受企業的行銷顧問委託。
                  </p>
                  <p>
                    我相信，在資訊爆炸的時代，品牌熱度很容易被下一波浪潮淹沒——但真正有底氣的品牌，靠的不是降價促銷，而是清晰的品牌故事與紮實的品牌形象。工具只是加分，把品牌做好才是根本。
                  </p>
                  <p>
                    每一次合作，我習慣先做訪談，確認目標對齊之後才開始執行。因為方向錯了，再努力也是白費。
                  </p>
                </div>

                <div className="about-content-block">
                  <h2>核心價值觀</h2>
                  <div className="value-cards">
                    <div className="value-card">
                      <div className="value-card-icon">💡</div>
                      <div>
                        <h4>沒有能不能，只有做不做</h4>
                        <p>遇到問題先找方法，不找藉口。行銷沒有萬能公式，但有解決思維。</p>
                      </div>
                    </div>
                    <div className="value-card">
                      <div className="value-card-icon">🔭</div>
                      <div>
                        <h4>高度決定視野</h4>
                        <p>格局大了，才不會糾結在小事上。幫客戶規劃時，我習慣先從全局看，再聚焦細節。</p>
                      </div>
                    </div>
                    <div className="value-card">
                      <div className="value-card-icon">📊</div>
                      <div>
                        <h4>資料先行，直覺輔助</h4>
                        <p>決策前先蒐集分析，再做判斷。廣告投放、SEO、社群都是數據說話的遊戲。</p>
                      </div>
                    </div>
                    <div className="value-card">
                      <div className="value-card-icon">🤝</div>
                      <div>
                        <h4>目標對齊，才開始執行</h4>
                        <p>每次合作前的訪談不是形式，是確認我們走在同一條路上的必要步驟。</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="about-content-block">
                  <h2>專業領域</h2>
                  <div className="expertise-grid">
                    {[
                      { icon: '🎯', title: '廣告投放', desc: 'Facebook / Instagram 廣告規劃、受眾測試、預算優化，從小測試到有效率地擴量。' },
                      { icon: '🔍', title: 'SEO 內容策略', desc: '關鍵字研究、內容架構規劃，撰寫對搜尋引擎與讀者都友善的長期流量內容。' },
                      { icon: '📣', title: '社群媒體經營', desc: 'Facebook、Instagram 帳號規劃，建立品牌一致的視覺語言，持續累積粉絲信任。' },
                      { icon: '🏷️', title: '品牌策略', desc: '從品牌故事、品牌形象到核心定位，幫助中小企業打造有辨識度、有溫度的品牌。' },
                      { icon: '📋', title: '行銷企劃書', desc: '整合活動目標、受眾分析、執行策略與預算，提供清晰可執行的行銷方案。' },
                      { icon: '🤖', title: 'AI 工具應用', desc: '將 Claude、Gemini 等 AI 工具整合進行銷工作流程，大幅提升內容產出效率。' },
                    ].map(e => (
                      <div key={e.title} className="expertise-item">
                        <div className="expertise-item-top">
                          <span className="expertise-icon">{e.icon}</span>
                          <h4>{e.title}</h4>
                        </div>
                        <p>{e.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="about-content-block">
                  <h2>為什麼選擇遠端合作</h2>
                  <p>
                    數位行銷的工作性質天然適合遠端。一份好的廣告策略、一篇好的 SEO 文章、一個好的品牌定位，不需要每天坐在同一個辦公室才能完成。
                  </p>
                  <p>
                    全台遠端合作，讓我能服務更多不同產業的客戶，也讓客戶不受地域限制，選擇最適合自己需求的行銷夥伴。
                  </p>
                </div>

                <div className="about-cta-box">
                  <h3>準備好開始了嗎？</h3>
                  <p>告訴我你的品牌現況和目標，我們一起找到最適合你的行銷方向。</p>
                  <Link href="/#contact" className="btn-white">立即洽詢合作 →</Link>
                </div>

              </article>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <p>© 2025 綾策 Ling Strategy｜品牌行銷顧問&nbsp;&nbsp;·&nbsp;&nbsp;用品牌思維做行銷，幫中小企業找到屬於自己的聲音</p>
      </footer>
    </>
  )
}
