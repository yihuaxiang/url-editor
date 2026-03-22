import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于 - URL 编辑器 | 告别 URL 手动改参烦恼，在线网址解析编辑工具',
  description:
    'urleditor.cn 专业在线 URL 解析编辑工具，零门槛、全兼容、高效率。支持 http/https，可视化编辑参数，解决开发者、运营者、办公族的 URL 编辑难题，免费无限制。',
  keywords:
    'URL编辑器,网址编辑,urleditor,在线URL工具,URL解析,参数编辑,免费工具,高效办公',
  openGraph: {
    type: 'website',
    url: 'https://urleditor.cn/about',
    title: '关于 - URL 编辑器 | 告别 URL 手动改参烦恼',
    description:
      'urleditor.cn 专业在线 URL 解析编辑工具，零门槛、全兼容、高效率，解决开发者、运营者、办公族的 URL 编辑难题。',
    images: ['/og-image.png'],
    siteName: 'URL 编辑器',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '关于 - URL 编辑器 | 告别 URL 手动改参烦恼',
    description:
      'urleditor.cn 专业在线 URL 解析编辑工具，零门槛、全兼容、高效率。',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://urleditor.cn/about',
  },
  robots: 'index, follow',
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '关于 URL 编辑器 - 在线网址解析编辑工具',
  description:
    'urleditor.cn 专业在线 URL 解析编辑工具，零门槛、全兼容、高效率，解决开发者、运营者、办公族的 URL 编辑难题。',
  url: 'https://urleditor.cn/about',
  isPartOf: {
    '@type': 'WebSite',
    url: 'https://urleditor.cn',
    name: 'URL 编辑器',
  },
};

export default function AboutPage() {
  return (
    <div className="app">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <header className="app-header">
        <nav className="header-nav" aria-label="主导航">
          <Link href="/" className="nav-link">
            首页
          </Link>
          <span className="nav-sep" aria-hidden="true">
            |
          </span>
          <span className="nav-link nav-link-active">关于</span>
        </nav>
        <h1>告别 URL 手动改参烦恼！</h1>
        <p>urleditor.cn 让网址编辑高效又省心</p>
      </header>

      <main className="app-main">
        <article className="intro-article">
          <section>
            <p>
              还在为手动修改 URL 参数反复核对、频繁出错而头疼？还在因不懂编码规则，导致链接跳转失败、推广链路断裂而焦虑？一款免费又实用的在线工具 ——
              urleditor.cn 来了！作为专业的在线 URL 解析编辑工具，它以极简操作、强大兼容，轻松解决开发者、运营者、办公族的 URL 编辑难题，让网址参数调整、链接解析变得简单高效，成为职场高效办公的实用利器。
            </p>
          </section>

          <section>
            <h2>URL 编辑的常见痛点</h2>
            <p>
              在日常工作中，URL 编辑是高频需求，却藏着诸多痛点：开发者调试接口时，手动拼接参数容易遗漏、编码出错，反复校验耗时耗力；运营人员生成活动推广链接，修改 UTM 参数、调整跳转路径时，因格式问题导致链接失效，影响营销转化；普通办公族分享链接时，面对冗长复杂的参数串，想精简优化却无从下手。而传统的 URL 编辑方式，要么需要专业的代码知识，要么依赖繁琐的本地软件，门槛高、操作繁，让很多人望而却步。
            </p>
          </section>

          <section>
            <h2>零门槛、全兼容、高效率</h2>
            <p>
              urleditor.cn 的出现，彻底打破了这些限制，以「零门槛、全兼容、高效率」的核心优势，重新定义 URL 编辑体验。它无需下载安装，打开网页即可使用，无需任何专业技术背景，无论是新手还是老手，都能快速上手。在核心功能上，工具支持直接粘贴或输入完整网址，可对 URL 的各个组成部分、各类参数进行可视化编辑，增删改查一步到位，告别手动敲代码的繁琐，从根源上减少出错概率，让每一次编辑都精准高效。
            </p>
          </section>

          <section>
            <h2>完美兼容常见协议</h2>
            <p>
              兼容性上，urleditor.cn 完美支持 http、https 等常见网络协议，覆盖日常办公、开发调试、营销推广等绝大多数使用场景，无论是普通的网页链接、活动推广链接，还是开发用的接口链接，都能轻松解析、灵活编辑，无需担心协议不兼容导致的解析失败问题。简洁的界面设计让操作路径一目了然，没有多余的功能按钮，输入、编辑、复制三步即可完成整个 URL 处理流程，极大提升工作效率，让原本需要几分钟的操作，几十秒就能搞定。
            </p>
          </section>

          <section>
            <h2>纯免费，无隐藏收费</h2>
            <p>
              作为一款纯免费的工具，urleditor.cn 没有隐藏收费项目，没有会员限制，所有核心功能全部开放，个人用户、企业用户均可无门槛使用，兼顾实用性与性价比。同时，页面搭配贴心的友情链接板块，联动优质工具平台，为用户提供更多办公辅助选择，打造一站式的高效办公体验。
            </p>
          </section>

          <section>
            <h2>适用人群广泛</h2>
            <p>
              从开发者日常接口调试、前端联调，到运营人员批量生成推广链接、调整营销参数，再到普通用户精简分享链接、优化网址结构，urleditor.cn 都能精准适配。它不仅是一款 URL 编辑工具，更是提升工作效率的「小帮手」，用极简的操作解决实际工作中的真实痛点，让每一个人都能轻松驾驭 URL 编辑。
            </p>
          </section>

          <section className="intro-cta">
            <h2>立即体验</h2>
            <p>
              如果你还在被 URL 编辑的各种问题困扰，不妨打开 urleditor.cn，体验一站式的网址解析编辑服务，告别手动改参的烦恼，让高效办公触手可及！
            </p>
            <Link href="/" className="btn btn-primary intro-cta-btn">
              开始使用 URL 编辑器
            </Link>
          </section>
        </article>
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
