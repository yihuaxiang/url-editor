import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#f3ede3',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://urleditor.cn'),
  title: 'URL 编辑器 - 在线解析、编辑并重组 URL',
  description:
    '一个把 URL 解析、字段编辑、参数管理和结果复制集中到同一页面的在线工具。',
  keywords:
    'URL编辑器,网址编辑,URL解析,查询参数编辑,URL构建器,在线URL工具,网址解析器,免费URL工具',
  authors: [{ name: 'URL Editor' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://urleditor.cn/',
    title: 'URL 编辑器 - 在线解析、编辑并重组 URL',
    description:
      '一个把 URL 解析、字段编辑、参数管理和结果复制集中到同一页面的在线工具。',
    images: ['/og-image.png'],
    siteName: 'URL 编辑器',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL 编辑器 - 在线解析、编辑并重组 URL',
    description:
      '一个把 URL 解析、字段编辑、参数管理和结果复制集中到同一页面的在线工具。',
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
    '一个把 URL 解析、字段编辑、参数管理和结果复制集中到同一页面的在线工具',
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
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
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
