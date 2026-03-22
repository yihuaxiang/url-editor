'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ParsedURL, QueryParam } from '@/lib/types';
import { URLParser } from '@/lib/urlParser';

interface UrlEditorProps {
  initialUrl?: string | null;
  initialParsedURL?: ParsedURL | null;
  initialQueryParams?: QueryParam[];
}

export default function UrlEditor({
  initialUrl,
  initialParsedURL = null,
  initialQueryParams = [],
}: UrlEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSyncingToUrl = useRef(false);
  const [inputURL, setInputURL] = useState(initialUrl ?? '');
  const [parsedURL, setParsedURL] = useState<ParsedURL | null>(initialParsedURL);
  const [queryParams, setQueryParams] = useState<QueryParam[]>(
    initialQueryParams
  );

  const handleURLInput = useCallback((url: string) => {
    setInputURL(url);
    const parsed = URLParser.parseURL(url);
    setParsedURL(parsed);
    setQueryParams(parsed.queryParams);
  }, []);

  // 先同步到地址栏（顺序重要：必须在「从 URL 读取」之前执行，避免用户输入被覆盖）
  useEffect(() => {
    if (inputURL) {
      isSyncingToUrl.current = true;
      const params = new URLSearchParams();
      params.set('u', inputURL);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [inputURL, pathname, router]);

  // 仅当 URL 栏参数变化时（如客户端导航、浏览器前进后退）更新
  useEffect(() => {
    if (isSyncingToUrl.current) {
      isSyncingToUrl.current = false;
      return;
    }
    const urlFromParam = searchParams.get('u') ?? initialUrl ?? '';
    if (urlFromParam && urlFromParam !== inputURL) {
      handleURLInput(urlFromParam);
    }
  }, [initialUrl, inputURL, handleURLInput, searchParams]);

  const handlePartChange = (field: keyof ParsedURL['parts'], value: string) => {
    if (!parsedURL) return;
    const updatedParts = { ...parsedURL.parts, [field]: value };
    const newURL = URLParser.buildURL(updatedParts, queryParams);
    setInputURL(newURL);
    handleURLInput(newURL);
  };

  const handleQueryParamChange = (
    id: string,
    field: 'key' | 'value',
    value: string
  ) => {
    const updatedParams = URLParser.updateQueryParam(
      queryParams,
      id,
      field,
      value
    );
    setQueryParams(updatedParams);
    if (parsedURL) {
      const newURL = URLParser.buildURL(parsedURL.parts, updatedParams);
      setInputURL(newURL);
    }
  };

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  useEffect(() => {
    const textareas = document.querySelectorAll('.param-value');
    textareas.forEach((textarea) => {
      if (textarea instanceof HTMLTextAreaElement) {
        autoResizeTextarea(textarea);
      }
    });
  }, [queryParams]);

  const addQueryParam = () => {
    setQueryParams(URLParser.addQueryParam(queryParams));
  };

  const removeQueryParam = (id: string) => {
    const updatedParams = URLParser.removeQueryParam(queryParams, id);
    setQueryParams(updatedParams);
    if (parsedURL) {
      const newURL = URLParser.buildURL(parsedURL.parts, updatedParams);
      setInputURL(newURL);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputURL);
    alert('URL 已复制到剪贴板！');
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleURLInput(text);
    } catch {
      alert('无法读取剪贴板内容');
    }
  };

  const openURL = () => {
    if (inputURL && inputURL.trim() !== '') {
      window.open(inputURL, '_blank', 'noopener,noreferrer');
    } else {
      alert('请先输入有效的 URL');
    }
  };

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
        <section
          className="url-input-section"
          aria-labelledby="input-section-title"
        >
          <h2 id="input-section-title" className="sr-only">
            URL 输入
          </h2>
          <div className="input-group">
            <label htmlFor="url-input">URL 输入框：</label>
            <div className="input-with-buttons">
              <input
                id="url-input"
                type="url"
                value={inputURL}
                onChange={(e) => handleURLInput(e.target.value)}
                placeholder="输入或粘贴 URL..."
                className="url-input"
                aria-describedby="url-input-help"
              />
              <div id="url-input-help" className="sr-only">
                在此输入完整的网址，支持 http、https 等协议
              </div>
              <button
                onClick={pasteFromClipboard}
                className="btn btn-secondary"
                aria-label="从剪贴板粘贴 URL"
              >
                粘贴
              </button>
              <button
                onClick={copyToClipboard}
                className="btn btn-primary"
                aria-label="复制当前 URL 到剪贴板"
              >
                复制
              </button>
            </div>
          </div>
        </section>

        {parsedURL && (
          <div className="url-editor">
            {!parsedURL.isValid && (
              <div className="error-message" role="alert" aria-live="polite">
                <strong>错误：</strong> {parsedURL.error}
              </div>
            )}

            <section className="url-parts" aria-labelledby="url-parts-title">
              <h2 id="url-parts-title">URL 组成部分</h2>

              <div
                className="form-grid"
                role="group"
                aria-labelledby="url-parts-title"
              >
                <div className="form-group">
                  <label htmlFor="protocol-input">协议 (Protocol)</label>
                  <input
                    id="protocol-input"
                    type="text"
                    value={parsedURL.parts.protocol}
                    onChange={(e) =>
                      handlePartChange('protocol', e.target.value)
                    }
                    placeholder="https:"
                    aria-describedby="protocol-help"
                  />
                  <div id="protocol-help" className="sr-only">
                    网址协议，如 https:、http:、ftp: 等
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="hostname-input">主机名 (Hostname)</label>
                  <input
                    id="hostname-input"
                    type="text"
                    value={parsedURL.parts.hostname}
                    onChange={(e) =>
                      handlePartChange('hostname', e.target.value)
                    }
                    placeholder="example.com"
                    aria-describedby="hostname-help"
                  />
                  <div id="hostname-help" className="sr-only">
                    域名或 IP 地址，如 example.com 或 192.168.1.1
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="port-input">端口 (Port)</label>
                  <input
                    id="port-input"
                    type="text"
                    value={parsedURL.parts.port}
                    onChange={(e) => handlePartChange('port', e.target.value)}
                    placeholder="443"
                    aria-describedby="port-help"
                  />
                  <div id="port-help" className="sr-only">
                    端口号，如 80、443、8080 等
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="pathname-input">路径 (Pathname)</label>
                  <input
                    id="pathname-input"
                    type="text"
                    value={parsedURL.parts.pathname}
                    onChange={(e) =>
                      handlePartChange('pathname', e.target.value)
                    }
                    placeholder="/path/to/resource"
                    aria-describedby="pathname-help"
                  />
                  <div id="pathname-help" className="sr-only">
                    URL 路径部分，如 /api/users 或 /index.html
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="hash-input">锚点 (Hash)</label>
                  <input
                    id="hash-input"
                    type="text"
                    value={parsedURL.parts.hash}
                    onChange={(e) => handlePartChange('hash', e.target.value)}
                    placeholder="#section"
                    aria-describedby="hash-help"
                  />
                  <div id="hash-help" className="sr-only">
                    页面锚点，用于定位到页面特定位置
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="username-input">用户名 (Username)</label>
                  <input
                    id="username-input"
                    type="text"
                    value={parsedURL.parts.username}
                    onChange={(e) =>
                      handlePartChange('username', e.target.value)
                    }
                    placeholder="username"
                    autoComplete="off"
                    aria-describedby="username-help"
                  />
                  <div id="username-help" className="sr-only">
                    HTTP 基本认证的用户名
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password-input">密码 (Password)</label>
                  <input
                    id="password-input"
                    type="text"
                    value={parsedURL.parts.password}
                    onChange={(e) =>
                      handlePartChange('password', e.target.value)
                    }
                    placeholder="password"
                    autoComplete="off"
                    aria-describedby="password-help"
                  />
                  <div id="password-help" className="sr-only">
                    HTTP 基本认证的密码
                  </div>
                </div>
              </div>
            </section>

            <section
              className="query-params"
              aria-labelledby="query-params-title"
            >
              <div className="query-params-header">
                <h2 id="query-params-title">查询参数 (Query Parameters)</h2>
                <button
                  onClick={addQueryParam}
                  className="btn btn-success"
                  aria-label="添加新的查询参数"
                >
                  添加参数
                </button>
              </div>

              <div
                className="query-params-list"
                role="group"
                aria-labelledby="query-params-title"
              >
                {queryParams.map((param, index) => (
                  <div
                    key={param.id}
                    className="query-param-item"
                    role="group"
                    aria-label={`查询参数 ${index + 1}`}
                  >
                    <label
                      htmlFor={`param-key-${param.id}`}
                      className="sr-only"
                    >
                      参数名 {index + 1}
                    </label>
                    <input
                      id={`param-key-${param.id}`}
                      type="text"
                      value={param.key}
                      onChange={(e) =>
                        handleQueryParamChange(param.id, 'key', e.target.value)
                      }
                      placeholder="参数名"
                      className="param-key"
                      aria-describedby={`param-key-help-${param.id}`}
                    />
                    <div
                      id={`param-key-help-${param.id}`}
                      className="sr-only"
                    >
                      查询参数的键名
                    </div>
                    <span className="equals" aria-hidden="true">
                      =
                    </span>
                    <label
                      htmlFor={`param-value-${param.id}`}
                      className="sr-only"
                    >
                      参数值 {index + 1}
                    </label>
                    <textarea
                      id={`param-value-${param.id}`}
                      value={param.value}
                      onChange={(e) => {
                        handleQueryParamChange(
                          param.id,
                          'value',
                          e.target.value
                        );
                        autoResizeTextarea(e.target);
                      }}
                      placeholder="参数值"
                      className="param-value"
                      aria-describedby={`param-value-help-${param.id}`}
                      rows={1}
                      style={{
                        minHeight: '32px',
                        resize: 'none',
                        overflow: 'hidden',
                      }}
                    />
                    <div
                      id={`param-value-help-${param.id}`}
                      className="sr-only"
                    >
                      查询参数的值
                    </div>
                    <button
                      onClick={() => removeQueryParam(param.id)}
                      className="btn btn-danger btn-small"
                      aria-label={`删除查询参数 ${param.key || '(空)'}`}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="result-section" aria-labelledby="result-title">
              <div className="result-header">
                <h2 id="result-title">最终 URL</h2>
                <button
                  onClick={openURL}
                  className="btn btn-primary"
                  disabled={!inputURL || inputURL.trim() === ''}
                  aria-label="在新标签页中打开 URL"
                >
                  打开
                </button>
              </div>
              <div
                className="result-url"
                role="textbox"
                aria-readonly
                aria-labelledby="result-title"
              >
                {inputURL || '请输入 URL'}
              </div>
            </section>
          </div>
        )}
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
