import React, { useState, useEffect } from 'react';
import { ParsedURL, QueryParam } from './types';
import { URLParser } from './urlParser';
import './App.css';

function App() {
  const [inputURL, setInputURL] = useState('');
  const [parsedURL, setParsedURL] = useState<ParsedURL | null>(null);
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);

  const handleURLInput = (url: string) => {
    setInputURL(url);
    const parsed = URLParser.parseURL(url);
    setParsedURL(parsed);
    setQueryParams(parsed.queryParams);
  };

  const handlePartChange = (field: keyof ParsedURL['parts'], value: string) => {
    if (!parsedURL) return;
    
    const updatedParts = { ...parsedURL.parts, [field]: value };
    const newURL = URLParser.buildURL(updatedParts, queryParams);
    setInputURL(newURL);
    handleURLInput(newURL);
  };

  const handleQueryParamChange = (id: string, field: 'key' | 'value', value: string) => {
    const updatedParams = URLParser.updateQueryParam(queryParams, id, field, value);
    setQueryParams(updatedParams);
    
    if (parsedURL) {
      const newURL = URLParser.buildURL(parsedURL.parts, updatedParams);
      setInputURL(newURL);
    }
  };

  const addQueryParam = () => {
    const updatedParams = URLParser.addQueryParam(queryParams);
    setQueryParams(updatedParams);
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
    } catch (err) {
      alert('无法读取剪贴板内容');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>URL 编辑器</h1>
        <p>粘贴或输入 URL，然后编辑其各个部分和参数</p>
      </header>

      <main className="app-main">
        <div className="url-input-section">
          <div className="input-group">
            <label htmlFor="url-input">URL 输入框：</label>
            <div className="input-with-buttons">
              <input
                id="url-input"
                type="text"
                value={inputURL}
                onChange={(e) => handleURLInput(e.target.value)}
                placeholder="输入或粘贴 URL..."
                className="url-input"
              />
              <button onClick={pasteFromClipboard} className="btn btn-secondary">
                粘贴
              </button>
              <button onClick={copyToClipboard} className="btn btn-primary">
                复制
              </button>
            </div>
          </div>
        </div>

        {parsedURL && (
          <div className="url-editor">
            {!parsedURL.isValid && (
              <div className="error-message">
                <strong>错误：</strong> {parsedURL.error}
              </div>
            )}

            <div className="url-parts">
              <h3>URL 组成部分</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>协议 (Protocol)</label>
                  <input
                    type="text"
                    value={parsedURL.parts.protocol}
                    onChange={(e) => handlePartChange('protocol', e.target.value)}
                    placeholder="https:"
                  />
                </div>

                <div className="form-group">
                  <label>主机名 (Hostname)</label>
                  <input
                    type="text"
                    value={parsedURL.parts.hostname}
                    onChange={(e) => handlePartChange('hostname', e.target.value)}
                    placeholder="example.com"
                  />
                </div>

                <div className="form-group">
                  <label>端口 (Port)</label>
                  <input
                    type="text"
                    value={parsedURL.parts.port}
                    onChange={(e) => handlePartChange('port', e.target.value)}
                    placeholder="443"
                  />
                </div>

                <div className="form-group">
                  <label>路径 (Pathname)</label>
                  <input
                    type="text"
                    value={parsedURL.parts.pathname}
                    onChange={(e) => handlePartChange('pathname', e.target.value)}
                    placeholder="/path/to/resource"
                  />
                </div>

                <div className="form-group">
                  <label>锚点 (Hash)</label>
                  <input
                    type="text"
                    value={parsedURL.parts.hash}
                    onChange={(e) => handlePartChange('hash', e.target.value)}
                    placeholder="#section"
                  />
                </div>

                <div className="form-group">
                  <label>用户名 (Username)</label>
                  <input
                    type="text"
                    value={parsedURL.parts.username}
                    onChange={(e) => handlePartChange('username', e.target.value)}
                    placeholder="username"
                  />
                </div>

                <div className="form-group">
                  <label>密码 (Password)</label>
                  <input
                    type="password"
                    value={parsedURL.parts.password}
                    onChange={(e) => handlePartChange('password', e.target.value)}
                    placeholder="password"
                  />
                </div>
              </div>
            </div>

            <div className="query-params">
              <div className="query-params-header">
                <h3>查询参数 (Query Parameters)</h3>
                <button onClick={addQueryParam} className="btn btn-success">
                  添加参数
                </button>
              </div>

              <div className="query-params-list">
                {queryParams.map((param) => (
                  <div key={param.id} className="query-param-item">
                    <input
                      type="text"
                      value={param.key}
                      onChange={(e) => handleQueryParamChange(param.id, 'key', e.target.value)}
                      placeholder="参数名"
                      className="param-key"
                    />
                    <span className="equals">=</span>
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => handleQueryParamChange(param.id, 'value', e.target.value)}
                      placeholder="参数值"
                      className="param-value"
                    />
                    <button
                      onClick={() => removeQueryParam(param.id)}
                      className="btn btn-danger btn-small"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="result-section">
              <h3>最终 URL</h3>
              <div className="result-url">
                {inputURL || '请输入 URL'}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
