import { ParsedURL, URLParts, QueryParam } from './types';

export class URLParser {
  static parseURL(urlString: string): ParsedURL {
    try {
      // 如果 URL 没有协议，添加默认的 https://
      if (!urlString.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
        urlString = 'https://' + urlString;
      }

      const url = new URL(urlString);
      
      const parts: URLParts = {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || '',
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        username: url.username || '',
        password: url.password || ''
      };

      const queryParams: QueryParam[] = [];
      url.searchParams.forEach((value, key) => {
        queryParams.push({
          key,
          value,
          id: Math.random().toString(36).substr(2, 9)
        });
      });

      return {
        original: urlString,
        parts,
        queryParams,
        isValid: true
      };
    } catch (error) {
      return {
        original: urlString,
        parts: {
          protocol: '',
          hostname: '',
          port: '',
          pathname: '',
          search: '',
          hash: '',
          username: '',
          password: ''
        },
        queryParams: [],
        isValid: false,
        error: error instanceof Error ? error.message : 'URL 解析失败'
      };
    }
  }

  static buildURL(parts: URLParts, queryParams: QueryParam[]): string {
    try {
      let url = '';
      
      // 构建协议和认证部分
      if (parts.username || parts.password) {
        const auth = parts.username + (parts.password ? ':' + parts.password : '');
        url = `${parts.protocol}//${auth}@${parts.hostname}`;
      } else {
        url = `${parts.protocol}//${parts.hostname}`;
      }
      
      // 添加端口
      if (parts.port) {
        url += ':' + parts.port;
      }
      
      // 添加路径
      url += parts.pathname;
      
      // 构建查询参数
      if (queryParams.length > 0) {
        const validParams = queryParams.filter(param => param.key.trim() !== '');
        if (validParams.length > 0) {
          const searchParams = new URLSearchParams();
          validParams.forEach(param => {
            searchParams.append(param.key, param.value);
          });
          url += '?' + searchParams.toString();
        }
      } else if (parts.search) {
        url += parts.search;
      }
      
      // 添加锚点
      if (parts.hash) {
        url += parts.hash;
      }
      
      return url;
    } catch (error) {
      return '';
    }
  }

  static addQueryParam(queryParams: QueryParam[]): QueryParam[] {
    return [
      ...queryParams,
      {
        key: '',
        value: '',
        id: Math.random().toString(36).substr(2, 9)
      }
    ];
  }

  static removeQueryParam(queryParams: QueryParam[], id: string): QueryParam[] {
    return queryParams.filter(param => param.id !== id);
  }

  static updateQueryParam(
    queryParams: QueryParam[], 
    id: string, 
    field: 'key' | 'value', 
    value: string
  ): QueryParam[] {
    return queryParams.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    );
  }
}
