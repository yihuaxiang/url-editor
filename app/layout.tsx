import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0d9488',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://urleditor.cn'),
  title: 'URL 编辑器 - 在线 URL 解析编辑工具 | 免费网址参数编辑器',
  description:
    '免费在线 URL 编辑器，支持解析、编辑网址的协议、域名、端口、路径、查询参数等。可视化编辑URL各个组成部分，支持批量管理查询参数，一键复制粘贴。',
  keywords:
    'URL编辑器,网址编辑,URL解析,查询参数编辑,URL构建器,在线URL工具,网址解析器,免费URL工具',
  authors: [{ name: 'URL Editor' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://urleditor.cn/',
    title: 'URL 编辑器 - 在线 URL 解析编辑工具',
    description:
      '免费在线 URL 编辑器，支持解析、编辑网址的协议、域名、端口、路径、查询参数等。可视化编辑URL各个组成部分。',
    images: ['/og-image.png'],
    siteName: 'URL 编辑器',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL 编辑器 - 在线 URL 解析编辑工具',
    description:
      '免费在线 URL 编辑器，支持解析、编辑网址的协议、域名、端口、路径、查询参数等。',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://urleditor.cn/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'URL 编辑器',
  description:
    '免费在线 URL 编辑器，支持解析、编辑网址的协议、域名、端口、路径、查询参数等',
  url: 'https://urleditor.cn/',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
  author: { '@type': 'Organization', name: 'URL Editor' },
  featureList: [
    'URL 解析',
    '可视化编辑',
    '查询参数管理',
    '剪贴板支持',
    '响应式设计',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        {children}
      </body>
    </html>
  );
}
