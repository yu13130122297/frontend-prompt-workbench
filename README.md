#  Prompt Workbench

**专业的提示词管理与生成工作台**

一个现代化的 AI 提示词管理工具，帮助开发者高效管理、编辑和生成各种场景下的 Prompt 模板。

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 功能特性

### 场景化管理
- **预置场景模板**：仿写新增、现有修改、接口对齐、单元测试等常用场景
- **自定义场景**：支持创建和保存个性化的提示词模板
- **场景切换**：快速在不同业务场景间切换
- **场景删除**：灵活管理不需要的场景

### 智能编辑
- **变量系统**：使用 `{变量名}` 语法标记动态内容
- **语法高亮**：自动识别并高亮显示变量
- **行号显示**：代码编辑器风格的行号标注
- **实时预览**：编辑模板的同时查看最终效果

### 动态输入
- **自动生成表单**：根据模板变量自动生成输入框
- **智能识别**：检测 `{变量名}` 并创建对应字段
- **输入持久化**：自动保存每个场景的输入值
- **变量验证**：高亮显示未填充的变量

### 实时预览
- **最终提示词预览**：查看变量替换后的完整内容
- **变量高亮**：绿色标记已填充的变量内容
- **统计信息**：字符数、词数统计
- **一键复制**：快速复制生成的提示词

### 数据持久化
- **自动保存**：编辑内容自动保存到本地配置
- **配置文件**：基于 JSON 的配置存储
- **零配置**：无需数据库，开箱即用
- **版本控制友好**：配置文件可纳入 Git 管理

---

## 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0（推荐）或 npm、yarn

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/yourusername/frontend-prompt-workbench.git
cd frontend-prompt-workbench
```

2. **安装依赖**

```bash
pnpm install
# 或
npm install
```

3. **启动开发服务器**

```bash
pnpm dev
# 或
npm run dev
```

4. **访问应用**

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

---

## 使用指南

### 1. 选择场景

在左侧边栏选择预置场景或创建新场景：
- **仿写新增**：参考现有代码实现新功能
- **现有修改**：修改现有代码
- **接口对齐**：JSON 转 TypeScript 接口
- **单元测试**：生成测试代码

### 2. 编辑模板

在模板编辑器中编写提示词：
```
你是一个资深前端专家。
请阅读以下文件：
{file_list}

任务目标：
{user_intent}
```

### 3. 填写变量

系统会自动识别 `{变量名}` 并生成输入框，填写对应内容：
- `file_list`: 需要处理的文件列表
- `user_intent`: 具体的任务描述

### 4. 预览与使用

- 在右侧预览面板查看最终生成的提示词
- 点击"复制提示词"按钮一键复制
- 点击"保存配置"将当前配置写入 config 目录

---

## 项目结构

```
frontend-prompt-workbench/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   └── config/              # 配置管理 API
│   │       └── route.ts         # GET/POST 配置
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 首页
├── components/                   # React 组件
│   ├── prompt-workbench/        # 工作台核心组件
│   │   ├── index.tsx           # 主容器
│   │   ├── scenario-sidebar.tsx # 场景侧边栏
│   │   ├── template-editor.tsx  # 模板编辑器
│   │   ├── dynamic-inputs.tsx   # 动态表单
│   │   └── preview-panel.tsx    # 预览面板
│   ├── ui/                      # shadcn/ui 组件库
│   └── theme-provider.tsx       # 主题提供者
├── config/                       # 配置文件目录
│   └── scenarios.json           # 场景配置（自动生成）
├── lib/                         # 工具函数
│   └── utils.ts                # 通用工具
├── public/                      # 静态资源
├── styles/                      # 样式文件
├── next.config.mjs              # Next.js 配置
├── tailwind.config.ts           # Tailwind 配置
├── tsconfig.json                # TypeScript 配置
└── package.json                 # 项目依赖
```

---

## 技术栈

### 核心框架
- **[Next.js 15](https://nextjs.org/)** - React 全栈框架
- **[React 19](https://react.dev/)** - UI 组件库
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全

### UI & 样式
- **[Tailwind CSS](https://tailwindcss.com/)** - 原子化 CSS 框架
- **[shadcn/ui](https://ui.shadcn.com/)** - 高质量组件库
- **[Radix UI](https://www.radix-ui.com/)** - 无障碍组件基础
- **[Lucide Icons](https://lucide.dev/)** - 图标库

### 开发工具
- **ESLint** - 代码检查
- **PostCSS** - CSS 处理
- **pnpm** - 包管理器

---

## 配置说明

### 配置文件位置

配置文件自动保存在 `config/scenarios.json`：

```json
{
  "scenarios": [
    {
      "id": "custom-1234567890",
      "name": "我的场景",
      "icon": "file",
      "template": "..."
    }
  ],
  "selectedId": "custom-1234567890",
  "inputValues": {
    "custom-1234567890": {
      "variable_name": "value"
    }
  },
  "lastSaved": "2026-02-05T12:00:00.000Z"
}
```

### 自定义主题

在 `app/globals.css` 中修改 CSS 变量：

```css
:root {
  --primary: 142 71% 45%;      /* 主题色 */
  --background: 220 13% 8%;     /* 背景色 */
  --foreground: 210 20% 95%;    /* 前景色 */
  /* ... */
}
```

---

## 特色功能

### 变量系统

使用花括号语法定义变量：
```
分析以下代码：
{code_snippet}

使用 {framework} 框架重构上述代码。
```

系统会自动生成 `code_snippet` 和 `framework` 两个输入框。

### 实时预览

- 已填充变量：绿色高亮显示
- 未填充变量：保持 `{变量名}` 格式
- 统计信息：实时显示字符数和词数

### 场景图标

支持的图标类型：
- `file` - 文件相关
- `wrench` - 修改调整
- `link` - 接口对齐
- `flask` - 测试相关

---

## 开发计划

- [ ] 支持场景分组和标签
- [ ] 添加提示词版本历史
- [ ] 支持 Markdown 预览模式
- [ ] 导入导出场景配置
- [ ] 多语言支持
- [ ] 快捷键支持
- [ ] 模板市场

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 许可证

本项目采用 [MIT](LICENSE) 许可证。

---

## 反馈与支持

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/yourusername/frontend-prompt-workbench/issues)
- 发送邮件至 your.email@example.com

---

<div align="center">

**如果这个项目对你有帮助，请给一个 Star**

Made with ♥ by [Your Name](https://github.com/yourusername)

</div>
