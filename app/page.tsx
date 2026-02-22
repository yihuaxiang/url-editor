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

  // 服务端解析 URL，用于 SSR 预渲染完整内容
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
        <nav className="header-nav" aria-label="主导航">
          <span className="nav-link nav-link-active">首页</span>
          <span className="nav-sep" aria-hidden="true">
            |
          </span>
          <Link href="/about" className="nav-link">
            关于
          </Link>
        </nav>
        <h1>URL 编辑器</h1>
        <p>粘贴或输入 URL，然后编辑其各个部分和参数</p>
      </header>
      <main className="app-main">
        <section className="url-input-section">
          <div className="input-group">
            <label htmlFor="url-input">URL 输入框：</label>
            <div className="input-with-buttons">
              <input
                id="url-input"
                type="url"
                placeholder="输入或粘贴 URL..."
                className="url-input"
                disabled
                readOnly
              />
              <button className="btn btn-secondary" disabled>
                粘贴
              </button>
              <button className="btn btn-primary" disabled>
                复制
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer className="app-footer">
        <span className="footer-label">友情链接：</span>
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
