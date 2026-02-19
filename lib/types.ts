export interface URLParts {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  username: string;
  password: string;
}

export interface QueryParam {
  key: string;
  value: string;
  id: string;
}

export interface ParsedURL {
  original: string;
  parts: URLParts;
  queryParams: QueryParam[];
  isValid: boolean;
  error?: string;
}
