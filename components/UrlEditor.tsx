'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ParsedURL, QueryParam } from '@/lib/types';
import { URLParser } from '@/lib/urlParser';

interface UrlEditorProps {
  initialUrl?: string | null;
  initialParsedURL?: ParsedURL | null;
  initialQueryParams?: QueryParam[];
}

type NoticeTone = 'success' | 'error' | 'info';

const partFields: Array<{
  field: keyof ParsedURL['parts'];
  label: string;
  placeholder: string;
  hint: string;
}> = [
  {
    field: 'protocol',
    label: '协议',
    placeholder: 'https:',
    hint: '常见值包括 https:、http:、ftp:。',
  },
  {
    field: 'hostname',
    label: '主机名',
    placeholder: 'example.com',
    hint: '可以是域名或 IP 地址。',
  },
  {
    field: 'port',
    label: '端口',
    placeholder: '443',
    hint: '留空时使用协议默认端口。',
  },
  {
    field: 'pathname',
    label: '路径',
    placeholder: '/products/list',
    hint: '建议包含前导斜杠。',
  },
  {
    field: 'hash',
    label: '锚点',
    placeholder: '#section',
    hint: '用于页面内定位。',
  },
  {
    field: 'username',
    label: '用户名',
    placeholder: 'username',
    hint: '仅在需要 Basic Auth 时填写。',
  },
  {
    field: 'password',
    label: '密码',
    placeholder: 'password',
    hint: '仅在需要 Basic Auth 时填写。',
  },
];

function normalizeProtocolLabel(protocol: string) {
  return protocol ? protocol.replace(/:$/, '').toUpperCase() : '待输入';
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
  const [parsedURL, setParsedURL] = useState<ParsedURL | null>(
    initialUrl ? initialParsedURL : null
  );
  const [queryParams, setQueryParams] = useState<QueryParam[]>(initialQueryParams);
  const [notice, setNotice] = useState<{
    tone: NoticeTone;
    text: string;
  } | null>(null);

  const currentUrlParam = searchParams.get('u') ?? '';

  const showNotice = useCallback((tone: NoticeTone, text: string) => {
    setNotice({ tone, text });
  }, []);

  const handleURLInput = useCallback((url: string) => {
    setInputURL(url);

    if (url.trim() === '') {
      setParsedURL(null);
      setQueryParams([]);
      return;
    }

    const parsed = URLParser.parseURL(url);
    setParsedURL(parsed);
    setQueryParams(parsed.queryParams);
  }, []);

  useEffect(() => {
    if (notice === null) return;

    const timeoutId = window.setTimeout(() => {
      setNotice(null);
    }, 2400);

    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  useEffect(() => {
    const nextValue = inputURL.trim();

    if (nextValue === currentUrlParam) return;

    isSyncingToUrl.current = true;

    if (nextValue) {
      const params = new URLSearchParams();
      params.set('u', inputURL);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      return;
    }

    router.replace(pathname, { scroll: false });
  }, [currentUrlParam, inputURL, pathname, router]);

  useEffect(() => {
    if (isSyncingToUrl.current) {
      isSyncingToUrl.current = false;
      return;
    }

    const urlFromParam = currentUrlParam || initialUrl || '';

    if (urlFromParam !== inputURL) {
      handleURLInput(urlFromParam);
    }
  }, [currentUrlParam, handleURLInput, initialUrl, inputURL]);

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
    textarea.style.height = `${textarea.scrollHeight}px`;
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

  const resolvedURL =
    parsedURL && parsedURL.isValid
      ? URLParser.buildURL(parsedURL.parts, queryParams) || parsedURL.original
      : inputURL;

  const copyToClipboard = async () => {
    if (!resolvedURL.trim()) {
      showNotice('error', '请先输入有效的 URL');
      return;
    }

    try {
      await navigator.clipboard.writeText(resolvedURL);
      showNotice('success', '当前 URL 已复制到剪贴板');
    } catch {
      showNotice('error', '复制失败，请检查浏览器权限');
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleURLInput(text);
      showNotice('success', '已从剪贴板导入链接');
    } catch {
      showNotice('error', '无法读取剪贴板内容');
    }
  };

  const openURL = () => {
    if (!resolvedURL.trim()) {
      showNotice('error', '请先输入有效的 URL');
      return;
    }

    window.open(resolvedURL, '_blank', 'noopener,noreferrer');
  };

  const filledFieldCount = parsedURL
    ? partFields.filter(({ field }) => parsedURL.parts[field].trim() !== '').length
    : 0;
  const validParamCount = queryParams.filter((param) => param.key.trim() !== '').length;
  const canOpen = Boolean(parsedURL?.isValid && resolvedURL.trim());
  const parserStatus = !parsedURL
    ? '等待输入'
    : parsedURL.isValid
      ? '解析完成'
      : '需要修正';

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
              协议、路径、端口和 query 参数都在同一个工作台里编辑，减少手动改参时的遗漏和格式错误。
            </p>
          </div>

          <div className="hero-badges" aria-label="主要特性">
            <span className="hero-badge">即时解析</span>
            <span className="hero-badge">实时输出</span>
            <span className="hero-badge">一键复制</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section
          className="surface url-input-section"
          aria-labelledby="input-section-title"
        >
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">开始编辑</span>
              <h2 id="input-section-title" className="panel-title">
                输入一条完整 URL
              </h2>
              <p className="panel-description">
                支持直接粘贴链接。输入后会自动解析协议、主机、路径和查询参数。
              </p>
            </div>

            <div className="panel-badges" aria-label="当前状态">
              <span
                className={`status-chip ${
                  parsedURL?.isValid
                    ? 'status-chip-success'
                    : parsedURL
                      ? 'status-chip-danger'
                      : 'status-chip-muted'
                }`}
              >
                {parserStatus}
              </span>
              <span className="status-chip status-chip-muted">
                参数 {validParamCount}
              </span>
            </div>
          </div>

          {notice && (
            <div
              className={`inline-notice inline-notice-${notice.tone}`}
              role="status"
              aria-live="polite"
            >
              {notice.text}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="url-input" className="input-label">
              URL 输入
            </label>
            <div className="input-with-buttons">
              <input
                id="url-input"
                type="url"
                value={inputURL}
                onChange={(e) => handleURLInput(e.target.value)}
                placeholder="https://example.com/products?utm_source=wechat"
                className="url-input"
                aria-describedby="url-input-help"
              />
              <div className="input-actions">
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
            <p id="url-input-help" className="input-help">
              示例：`https://example.com/products?utm_source=wechat&utm_medium=social`
            </p>
          </div>
        </section>

        {parsedURL ? (
          <div className="editor-stack">
            {!parsedURL.isValid && (
              <div className="status-banner status-banner-danger" role="alert">
                <strong>当前 URL 无法完整解析：</strong> {parsedURL.error}
              </div>
            )}

            <section className="surface result-section" aria-labelledby="result-title">
              <div className="result-header">
                <div>
                  <span className="panel-eyebrow">实时结果</span>
                  <h2 id="result-title" className="panel-title">
                    最终 URL
                  </h2>
                </div>
                <button
                  onClick={openURL}
                  className="btn btn-primary"
                  disabled={!canOpen}
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
                {resolvedURL || '请输入 URL'}
              </div>

              <div className="result-meta" aria-label="URL 摘要">
                <span className="meta-pill">
                  协议 {normalizeProtocolLabel(parsedURL.parts.protocol)}
                </span>
                <span className="meta-pill">
                  主机 {parsedURL.parts.hostname || '未填写'}
                </span>
                <span className="meta-pill">已填字段 {filledFieldCount}</span>
                <span className="meta-pill">参数 {validParamCount}</span>
              </div>
            </section>

            <section className="surface url-parts" aria-labelledby="url-parts-title">
              <div className="section-heading">
                <div>
                  <span className="panel-eyebrow">URL 结构</span>
                  <h2 id="url-parts-title" className="panel-title">
                    逐项编辑 URL 组成部分
                  </h2>
                </div>
              </div>

              <div
                className="form-grid"
                role="group"
                aria-labelledby="url-parts-title"
              >
                {partFields.map(({ field, label, placeholder, hint }) => {
                  const inputId = `${field}-input`;
                  const helpId = `${field}-help`;

                  return (
                    <div key={field} className="form-group">
                      <label htmlFor={inputId}>{label}</label>
                      <input
                        id={inputId}
                        type="text"
                        value={parsedURL.parts[field]}
                        onChange={(e) => handlePartChange(field, e.target.value)}
                        placeholder={placeholder}
                        autoComplete="off"
                        aria-describedby={helpId}
                      />
                      <div id={helpId} className="form-hint">
                        {hint}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section
              className="surface query-params"
              aria-labelledby="query-params-title"
            >
              <div className="query-params-header">
                <div>
                  <span className="panel-eyebrow">查询参数</span>
                  <h2 id="query-params-title" className="panel-title">
                    管理查询参数
                  </h2>
                </div>
                <button
                  onClick={addQueryParam}
                  className="btn btn-success"
                  aria-label="添加新的查询参数"
                >
                  添加参数
                </button>
              </div>

              {queryParams.length === 0 ? (
                <div className="query-empty">
                  当前没有 query 参数。需要时可直接新增一项。
                </div>
              ) : (
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
                      <div className="query-param-fields">
                        <div className="query-param-field">
                          <label
                            htmlFor={`param-key-${param.id}`}
                            className="query-label"
                          >
                            参数名
                          </label>
                          <input
                            id={`param-key-${param.id}`}
                            type="text"
                            value={param.key}
                            onChange={(e) =>
                              handleQueryParamChange(
                                param.id,
                                'key',
                                e.target.value
                              )
                            }
                            placeholder="utm_source"
                            className="param-key"
                          />
                        </div>

                        <div className="query-param-field query-param-field-wide">
                          <label
                            htmlFor={`param-value-${param.id}`}
                            className="query-label"
                          >
                            参数值
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
                            placeholder="wechat"
                            className="param-value"
                            rows={1}
                            style={{
                              minHeight: '42px',
                              resize: 'none',
                              overflow: 'hidden',
                            }}
                          />
                        </div>
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
              )}
            </section>
          </div>
        ) : (
          <section className="surface empty-state" aria-labelledby="empty-state-title">
            <span className="panel-eyebrow">准备开始</span>
            <h2 id="empty-state-title">先输入链接，再开始拆解和改参。</h2>
            <p>
              输入后会自动生成可编辑字段和 query 参数列表，最终结果会实时回写到输出区。
            </p>
          </section>
        )}
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
