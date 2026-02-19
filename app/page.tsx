import { Suspense } from 'react';
import UrlEditor from '@/components/UrlEditor';

interface PageProps {
  searchParams: Promise<{ u?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialUrl = params.u ?? null;

  return (
    <Suspense fallback={<UrlEditorFallback />}>
      <UrlEditor initialUrl={initialUrl} />
    </Suspense>
  );
}

function UrlEditorFallback() {
  return (
    <div className="app">
      <header className="app-header">
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
    </div>
  );
}
