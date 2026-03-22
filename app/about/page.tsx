import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于 - URL 编辑器 | 面向日常改链路的在线 URL 工具',
  description:
    'URL 编辑器提供清晰的 URL 解析、参数编辑和结果复制体验，适合开发、运营和日常协作中的改链接场景。',
  keywords:
    'URL编辑器,网址编辑,URL解析,在线URL工具,参数编辑,免费工具,改链接',
  openGraph: {
    type: 'website',
    url: 'https://urleditor.cn/about',
    title: '关于 - URL 编辑器',
    description:
      '一个把 URL 拆解、编辑和复制流程集中到同一页面的在线工具。',
    images: ['/og-image.png'],
    siteName: 'URL 编辑器',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '关于 - URL 编辑器',
    description:
      '一个把 URL 拆解、编辑和复制流程集中到同一页面的在线工具。',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://urleditor.cn/about',
  },
  robots: 'index, follow',
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '关于 URL 编辑器',
  description:
    '一个把 URL 拆解、编辑和复制流程集中到同一页面的在线工具。',
  url: 'https://urleditor.cn/about',
  isPartOf: {
    '@type': 'WebSite',
    url: 'https://urleditor.cn',
    name: 'URL 编辑器',
  },
};

const aboutSections = [
  {
    title: '为什么做这个工具',
    body:
      '很多改链接场景并不复杂，但手动改 query、端口、路径和锚点时很容易出错。这个工具的目标不是“展示很多功能”，而是把高频操作放在一个清楚、顺手的界面里。',
  },
  {
    title: '适合谁使用',
    body:
      '开发者可以快速调试接口地址，运营可以稳定改活动参数，内容和商务同学也能在不碰代码的情况下整理分享链接。',
  },
  {
    title: '核心体验',
    body:
      '输入 URL 后立即解析，字段和参数分区展示，最终结果实时回写。复制、粘贴和打开链接都保持在同一个工作流里，不需要反复切换工具。',
  },
  {
    title: '设计原则',
    body:
      '界面保持克制，优先让输入和结果清晰可读；视觉上有足够的层级，但不会为了装饰牺牲操作效率。',
  },
];

export default function AboutPage() {
  return (
    <div className="app">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <header className="app-header">
        <div className="header-topbar">
          <Link href="/" className="brand-mark">
            URL Editor
          </Link>
          <nav className="header-nav" aria-label="主导航">
            <Link href="/" className="nav-link">
              首页
            </Link>
            <span className="nav-link nav-link-active">关于</span>
          </nav>
        </div>

        <div className="hero hero-compact hero-single-line">
          <div className="hero-copy">
            <span className="hero-kicker">About the product</span>
            <h1>为改链接场景做的在线工具</h1>
            <p>
              URL Editor 专注一件事：让 URL 的解析、编辑和输出都足够清楚。
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="about-grid" aria-label="产品说明">
          {aboutSections.map((section) => (
            <article key={section.title} className="surface about-card">
              <span className="panel-eyebrow">About</span>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </section>

        <section className="surface about-cta">
          <div>
            <span className="panel-eyebrow">Ready to edit</span>
            <h2>直接回到首页开始处理 URL。</h2>
            <p>
              复制一条链接进来，就能立即拆开查看、逐项修改并生成最终结果。
            </p>
          </div>
          <Link href="/" className="btn btn-primary">
            返回首页
          </Link>
        </section>
      </main>

      <footer className="app-footer">
        <span className="footer-label">友情链接</span>
        <a
          href="https://imgbed.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          图床小镇
        </a>
      </footer>
    </div>
  );
}
