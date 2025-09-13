# URL 编辑器

一个功能强大的 URL 编辑器，可以解析、编辑和重构 URL 的各个组成部分。

## 功能特性

- 🔍 **URL 解析**：自动解析 URL 的各个组成部分
- ✏️ **可视化编辑**：分别编辑协议、主机名、端口、路径等
- 🔧 **查询参数管理**：添加、删除、修改查询参数
- 📋 **剪贴板支持**：一键粘贴和复制 URL
- 📱 **响应式设计**：支持桌面和移动设备
- 🎨 **现代化界面**：美观的用户界面设计

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 使用方法

1. **输入 URL**：在顶部输入框中输入或粘贴要编辑的 URL
2. **编辑组成部分**：在"URL 组成部分"区域修改各个部分
3. **管理查询参数**：在"查询参数"区域添加、修改或删除参数
4. **查看结果**：在底部查看最终生成的 URL
5. **复制结果**：点击"复制"按钮将结果复制到剪贴板

## 支持的 URL 组成部分

- **协议 (Protocol)**：如 `https:`, `http:`, `ftp:` 等
- **主机名 (Hostname)**：如 `example.com`, `localhost` 等
- **端口 (Port)**：如 `443`, `8080` 等
- **路径 (Pathname)**：如 `/path/to/resource` 等
- **锚点 (Hash)**：如 `#section` 等
- **用户名 (Username)**：用于认证的用户名
- **密码 (Password)**：用于认证的密码
- **查询参数 (Query Parameters)**：如 `?key=value&foo=bar` 等

## 技术栈

- React 18
- TypeScript
- Vite
- CSS3

## 开发

项目使用 Vite 作为构建工具，支持热重载和快速开发。

### 项目结构

```
src/
├── types.ts          # TypeScript 类型定义
├── urlParser.ts      # URL 解析和构建逻辑
├── App.tsx           # 主应用组件
├── App.css           # 应用样式
├── main.tsx          # 应用入口
└── index.css         # 全局样式
```

## 许可证

MIT License


## 开发注意

node 18
