import { Suspense } from 'react';
import Link from 'next/link';
import UrlEditor from '@/components/UrlEditor';
import { URLParser } from '@/lib/urlParser';

interface PageProps {
  searchParams: Promise<{ u?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialUrl = params.u ?? null;
  const initialParsed = initialUrl ? URLParser.parseURL(initialUrl) : null;

  return (
    <Suspense fallback={<UrlEditorFallback />}>
      <UrlEditor
        initialUrl={initialUrl}
        initialParsedURL={initialParsed}
        initialQueryParams={initialParsed?.queryParams ?? []}
      />
    </Suspense>
  );
}

function UrlEditorFallback() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-topbar">
          <Link href="/" className="brand-mark">
            URL Editor
          </Link>
          <nav className="header-nav" aria-label="主导航">
            <span className="nav-link nav-link-active">首页</span>
            <Link href="/about" className="nav-link">
              关于
            </Link>
          </nav>
        </div>
        <div className="hero">
          <div className="hero-copy">
            <span className="hero-kicker">URL 编辑工作台</span>
            <h1>快速编辑 URL 和参数</h1>
            <p>
              输入区优先展示，解析、改参、复制都在同一视图完成。
            </p>
          </div>
          <div className="hero-badges" aria-label="主要特性">
            <span className="hero-badge">即时解析</span>
            <span className="hero-badge">精准编辑</span>
            <span className="hero-badge">一键复制</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="surface url-input-section">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">开始编辑</span>
              <h2 className="panel-title">输入一条完整 URL</h2>
              <p className="panel-description">
                支持直接粘贴链接，页面会自动解析协议、路径和查询参数。
              </p>
            </div>
            <div className="panel-badges">
              <span className="status-chip status-chip-muted">加载中</span>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="url-input" className="input-label">
              URL 输入
            </label>
            <div className="input-with-buttons">
              <input
                id="url-input"
                type="url"
                placeholder="https://example.com/products?utm_source=wechat"
                className="url-input"
                disabled
                readOnly
              />
              <div className="input-actions">
                <button className="btn btn-secondary" disabled>
                  粘贴
                </button>
                <button className="btn btn-primary" disabled>
                  复制
                </button>
              </div>
            </div>
          </div>
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
