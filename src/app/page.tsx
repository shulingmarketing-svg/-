'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Article {
  id: string
  title: string
  date: string
  category: string
  summary: string
  content: string
  published: boolean
}

function mdToHtml(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .split('\n\n')
    .map(p => (p.startsWith('<h3>') || p.startsWith('<ul>') ? p : `<p>${p}</p>`))
    .join('')
}

const MARQUEE_ITEMS = [
  '品牌策略', '廣告投放', '社群媒體經營', 'SEO 內容規劃',
  '行銷企劃書', 'AI 工具導入', '個人品牌建立', '中小企業行銷',
]

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [loadingArticles, setLoadingArticles] = useState(true)
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)
  const [submitDone, setSubmitDone] = useState(false)
  const [nlDone, setNlDone] = useState(false)
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [articles])

  useEffect(() => {
    fetch('data/articles.json?t=' + Date.now())
      .then(r => r.json())
      .then((data: Article[]) => {
        setArticles(data.filter(a => a.published).sort((a, b) => b.date.localeCompare(a.date)))
      })
      .catch(() => {})
      .finally(() => setLoadingArticles(false))
  }, [])

  useEffect(() => {
    if (activeArticle) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [activeArticle])

  return (
    <>
      {/* NAV */}
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <a className="nav-logo" href="#home">綾策 <span>Ling Strategy</span></a>
        <ul className="nav-links">
          <li><a href="#services">服務項目</a></li>
          <li><a href="#articles">文章</a></li>
          <li><a href="#about">關於我</a></li>
          <li><a href="#contact">聯絡我</a></li>
        </ul>
        <a className="nav-cta" href="#contact">合作洽詢</a>
      </nav>

      {/* HERO */}
      <section id="home">
        <div className="hero-bg-glow hero-bg-glow-1" />
        <div className="hero-bg-glow hero-bg-glow-2" />
        <div className="hero-bg-glow hero-bg-glow-3" />
        <div className="hero-grid">
          <div className="hero-text">
            <div className="hero-eyebrow reveal">
              <div className="hero-eyebrow-dot" />
              品牌行銷顧問 · 社群 · 廣告 · SEO
            </div>
            <h1 className="hero-title reveal reveal-delay-1">
              用<span className="highlight">品牌思維</span><br />
              幫中小企業<br />找到自己的聲音
            </h1>
            <p className="hero-desc reveal reveal-delay-2">
              不靠促銷降價維持熱度，回到品牌故事的根本。<br />
              工具是加分，品牌力才是核心。
            </p>
            <div className="hero-btns reveal reveal-delay-3">
              <a className="btn-glow" href="#services">了解服務</a>
              <Link className="btn-ghost" href="/about/">認識芓綾</Link>
            </div>
            <div className="hero-metrics reveal reveal-delay-4">
              <div className="hero-metric"><strong>6+</strong><span>服務項目</span></div>
              <div className="hero-metric"><strong>AI</strong><span>深度應用</span></div>
              <div className="hero-metric"><strong>全台</strong><span>遠端合作</span></div>
            </div>
          </div>
          <div className="hero-right reveal reveal-delay-2">
            <div className="hero-card-main">
              <div className="hero-card-header">
                <div className="hero-avatar">
                  <Image src="/avatar.jpg" alt="芓綾" width={52} height={52} />
                </div>
                <div>
                  <div className="hero-card-name">芓綾</div>
                  <div className="hero-card-role">網路行銷 × 品牌策略顧問</div>
                </div>
              </div>
              <div className="hero-tag-list">
                {['FB 廣告投放','SEO 內容規劃','社群經營','品牌策略','行銷企劃','AI 工具應用'].map(t => (
                  <span key={t} className="hero-tag-item">{t}</span>
                ))}
              </div>
            </div>
            <div className="hero-card-quote">
              <p>「沒有能不能，只有做不做。<br />高度不夠，看到的都是問題；格局太小，糾結的都是小事。」</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              {item} <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services">
        <div className="section-inner">
          <div className="services-header">
            <div className="section-eyebrow reveal">服務項目</div>
            <h2 className="section-title reveal reveal-delay-1">我能幫你做什麼</h2>
            <p className="section-desc reveal reveal-delay-2">每個合作都從目標對齊的訪談開始，確認方向後再執行，讓每一分預算花在刀口上。</p>
          </div>
          <div className="services-grid">
            {[
              { icon: '📣', title: '社群媒體經營', desc: 'Facebook、Instagram 內容規劃與文案撰寫，建立品牌一致的視覺與語言風格，持續累積受眾信任。', delay: '' },
              { icon: '🎯', title: '廣告投放顧問', desc: '從小預算測試出發，觀察 CPC 與轉換數據，找到最有效率的投放策略，讓廣告費用創造真實成效。', delay: 'reveal-delay-1' },
              { icon: '🔍', title: 'SEO 內容規劃', desc: '關鍵字研究、網站內容架構規劃，撰寫對搜尋引擎友善、對讀者有價值的長期流量內容。', delay: 'reveal-delay-2' },
              { icon: '📋', title: '行銷企劃書', desc: '協助整合活動目標、受眾分析、執行策略與預算規劃，提供清晰可執行的行銷企劃方案。', delay: 'reveal-delay-3' },
              { icon: '🏷️', title: '品牌策略建立', desc: '從品牌故事、品牌形象到核心價值定位，幫助中小企業打造有辨識度、有溫度的品牌。', delay: 'reveal-delay-4' },
              { icon: '🤖', title: 'AI 工具導入', desc: '協助企業或個人將 Claude、Gemini 等 AI 工具整合進行銷工作流程，提升內容產出效率。', delay: 'reveal-delay-5' },
            ].map(s => (
              <div key={s.title} className={`service-card reveal ${s.delay}`}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section id="about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-visual reveal">
              <div className="about-img-box">
                <Image src="/profile.JPG" alt="芓綾" fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
              </div>
              <div className="about-badge"><strong>AI</strong>工具深度使用者</div>
            </div>
            <div className="about-content">
              <div className="section-eyebrow reveal">關於我</div>
              <h2 className="section-title reveal reveal-delay-1">你好，我是芓綾</h2>
              <div className="about-body reveal reveal-delay-2">
                <p>一個在網路行銷這條路上持續自學、持續前進的實踐者。目前主要負責廣告投放、SEO 內容規劃與社群平台的日常經營，同時接受企業的行銷顧問委託。</p>
                <p>我相信，在資訊爆炸的時代，品牌熱度很容易被下一波浪潮淹沒——但真正有底氣的品牌，靠的不是降價促銷，而是清晰的品牌故事與紮實的品牌形象。</p>
              </div>
              <div className="about-values reveal reveal-delay-3">
                <div className="about-value"><span className="about-value-icon">💡</span><span>沒有能不能，只有做不做——遇到問題，先找方法，不找藉口</span></div>
                <div className="about-value"><span className="about-value-icon">🔭</span><span>高度決定視野——格局大，才不會糾結在小事上</span></div>
                <div className="about-value"><span className="about-value-icon">📊</span><span>資料先行，直覺輔助——決策前先蒐集分析，再做判斷</span></div>
              </div>
              <div style={{ marginTop: '2rem' }} className="reveal reveal-delay-4">
                <Link href="/about/" className="btn-glow" style={{ display: 'inline-block' }}>了解更多關於我 →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process">
        <div className="section-inner">
          <div className="section-eyebrow reveal">合作流程</div>
          <h2 className="section-title reveal reveal-delay-1">從詢問到啟動，五個步驟</h2>
          <p className="section-desc reveal reveal-delay-2">清楚的流程讓雙方都有安全感，確認方向後才開始執行，不讓任何一步白費。</p>
          <div className="process-steps">
            {[
              { num: '01', title: '填寫表單', desc: '簡單說明你的產業與需求', delay: '' },
              { num: '02', title: '確認回覆', desc: '兩個工作天內回覆', delay: 'reveal-delay-1' },
              { num: '03', title: '目標對齊', desc: '30 分鐘訪談確認方向', delay: 'reveal-delay-2' },
              { num: '04', title: '提案報價', desc: '提供服務方案與費用', delay: 'reveal-delay-3' },
              { num: '05', title: '正式啟動', desc: '確認合作，開始執行', delay: 'reveal-delay-4' },
            ].map(s => (
              <div key={s.num} className={`process-step reveal ${s.delay}`}>
                <div className="process-num">{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section id="articles">
        <div className="section-inner">
          <div className="section-eyebrow reveal">最新文章</div>
          <h2 className="section-title reveal reveal-delay-1">行銷觀點 · 實戰筆記</h2>
          <p className="section-desc reveal reveal-delay-2">分享品牌行銷的實戰經驗與觀點，幫助你少走彎路。</p>
          <div className="articles-grid reveal reveal-delay-2">
            {loadingArticles ? (
              [1,2,3].map(i => <div key={i} className="article-skeleton" />)
            ) : articles.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', gridColumn: '1/-1' }}>即將推出文章，敬請期待。</p>
            ) : articles.map(a => (
              <article
                key={a.id}
                className="article-card reveal"
                onClick={() => setActiveArticle(a)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setActiveArticle(a)}
                aria-label={`閱讀文章：${a.title}`}
              >
                <div className="article-card-top">
                  <span className="article-tag">{a.category}</span>
                  <span className="article-date">{a.date}</span>
                </div>
                <h3 className="article-card-title">{a.title}</h3>
                <p className="article-card-summary">{a.summary}</p>
                <span className="article-read-more">閱讀全文 →</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="newsletter">
        <div className="section-inner">
          <div className="newsletter-inner reveal">
            <div className="newsletter-text">
              <div className="section-eyebrow" style={{ color: '#a5b4fc' }}>電子報</div>
              <h2 className="section-title" style={{ color: '#fff' }}>訂閱芓綾的行銷週報</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: '1.8', maxWidth: '420px' }}>
                每週一封，分享行銷趨勢、AI 工具應用、品牌策略實戰筆記。<br />
                不灌水，只送真正有用的內容。
              </p>
            </div>
            <div className="newsletter-form-wrap">
              {nlDone ? (
                <p style={{ color: '#a5b4fc', fontWeight: 600, textAlign: 'center', padding: '1rem 0' }}>✓ 訂閱成功！感謝你的加入</p>
              ) : (
                <>
                  <form className="nl-form" onSubmit={e => { e.preventDefault(); setNlDone(true) }}>
                    <input type="email" placeholder="輸入你的 Email" required />
                    <button type="submit">免費訂閱</button>
                  </form>
                  <p className="nl-note">不發垃圾郵件，隨時可取消訂閱</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="section-inner">
          <div className="section-eyebrow reveal">聯絡我</div>
          <h2 className="section-title reveal reveal-delay-1">開始一次合作</h2>
          <p className="section-desc reveal reveal-delay-2">告訴我你的需求，讓我們一起找到屬於你品牌的聲音。</p>
          <div className="contact-grid">
            <form className="contact-form reveal reveal-delay-1" onSubmit={e => { e.preventDefault(); setSubmitDone(true) }}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">您的姓名</label>
                  <input id="name" type="text" placeholder="王小明" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">聯絡信箱</label>
                  <input id="email" type="email" placeholder="hello@example.com" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="service">需要的服務</label>
                <select id="service">
                  <option value="">請選擇服務項目</option>
                  {['社群媒體經營','廣告投放顧問','SEO 內容規劃','行銷企劃書','品牌策略建立','AI 工具導入','其他'].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">簡單說說你的需求</label>
                <textarea id="message" placeholder="例如：我是餐飲業，想開始經營 Instagram..." />
              </div>
              <button
                type="submit"
                className="btn-submit"
                style={submitDone ? { background: 'linear-gradient(135deg,#059669,#10b981)' } : {}}
                disabled={submitDone}
              >
                {submitDone ? '已送出！感謝你的詢問 ✓' : '送出詢問 →'}
              </button>
            </form>
            <div className="contact-side reveal reveal-delay-2">
              <div className="contact-quote-box">
                <p>「每個品牌都有屬於自己的聲音，我的工作是幫你找到它，然後讓更多人聽見。」</p>
              </div>
              <div className="contact-flow">
                <h4>合作流程</h4>
                <div className="contact-flow-list">
                  {['填寫表單說明需求','兩個工作天內回覆確認','安排 30 分鐘目標對齊訪談','提供服務方案與報價','確認合作，正式啟動'].map((step, i) => (
                    <div key={i} className="contact-flow-item">
                      <div className="flow-num">{i + 1}</div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2025 綾策 Ling Strategy｜品牌行銷顧問&nbsp;&nbsp;·&nbsp;&nbsp;用品牌思維做行銷，幫中小企業找到屬於自己的聲音</p>
      </footer>

      {/* ARTICLE MODAL */}
      <div
        className={`article-modal ${activeArticle ? 'open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) setActiveArticle(null) }}
        role="dialog"
        aria-modal="true"
        aria-label={activeArticle?.title}
      >
        <div className="modal-box">
          <button className="modal-close" onClick={() => setActiveArticle(null)} aria-label="關閉">✕</button>
          {activeArticle && (
            <>
              <div className="modal-meta">
                <span className="article-tag">{activeArticle.category}</span>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem', marginLeft: '0.8rem' }}>{activeArticle.date}</span>
              </div>
              <h2 className="modal-title">{activeArticle.title}</h2>
              <div className="modal-body" dangerouslySetInnerHTML={{ __html: mdToHtml(activeArticle.content) }} />
            </>
          )}
        </div>
      </div>
    </>
  )
}
