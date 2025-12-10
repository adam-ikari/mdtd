# mdtd 项目说明

## 项目概述

mdtd 是一个基于 Ink 和 React 构建的美观终端 UI 待办事项应用。它允许用户在终端中创建、管理和完成待办事项，并将数据持久化存储在 Markdown 文件中。该应用支持多语言界面和任务层次结构管理。

## 技术栈

- **前端框架**: React + Ink (用于终端 UI)
- **状态管理**: Zustand
- **构建工具**: esbuild
- **国际化**: 自定义 i18n 实现
- **语言**: TypeScript
- **包管理**: npm/yarn/pnpm

## 项目结构

```
src/
├── App.tsx               # 主应用组件
├── cli.tsx              # CLI 入口点
├── components/
│   └── InputBox.tsx     # 输入框组件
├── locales/
│   ├── en.json          # 英文翻译
│   └── zh.json          # 中文翻译
├── services/
│   ├── fileManager.ts   # 文件读写和任务解析
│   └── i18n.ts          # 国际化服务
└── store/
    └── taskStore.ts     # Zustand 状态管理
```

## 功能特性

1. **交互式终端界面**: 使用 Ink 和 React 构建的直观界面
2. **任务管理**: 添加、完成、删除和编辑任务
3. **任务移动**: 支持使用 Shift+J/K 移动任务顺序
4. **层级管理**: 使用 H/L 键管理任务层级结构
5. **持久化存储**: 将任务保存到 Markdown 文件
6. **多语言支持**: 支持中英文界面
7. **YAML 前置元数据**: 自动处理创建和修改时间

## 构建和运行

### 开发环境

```bash
# 安装依赖
npm install
# 或使用 yarn
yarn install
# 或使用 pnpm
pnpm install

# 构建项目
npm run build

# 运行应用
npm start
```

### 全局安装

```bash
# 全局安装
npm install -g mdtd

# 或直接使用 npx
npx mdtd
```

### 使用方法

```bash
# 使用默认的 todo.md 文件
mdtd

# 指定文件名
mdtd filename.md

# 指定语言
mdtd --lang zh filename.md
```

## 控制键说明

在列表模式下:
- `A` - 添加任务
- `E` - 编辑选中任务
- `空格` - 切换任务完成状态
- `D` - 删除选中任务
- `J`/`K` - 上下选择任务
- `Shift+J`/`Shift+K` - 移动任务位置
- `H`/`L` - 提升/降低任务层级
- `Q` - 退出应用

## 开发约定

1. **代码风格**: 使用 TypeScript，遵循 React 最佳实践
2. **状态管理**: 使用 Zustand 进行全局状态管理
3. **国际化**: 所有用户界面文本都应通过 `t()` 函数进行国际化
4. **文件格式**: 任务存储在 Markdown 文件中，支持 YAML 前置元数据

## 文件格式

任务文件支持以下格式:

```markdown
---
created: 2025-12-09T00:00:00.000Z
modified: 2025-12-09T00:00:00.000Z
---
# TODO

- [ ] 顶级任务
  - [x] 子任务
  - [ ] 另一个子任务
- [ ] 另一个顶级任务
```

## 构建配置

项目使用 esbuild 进行打包，配置文件为 `esbuild.config.js`。支持别名 `@` 指向 `src` 目录，并使用 Babel 预设处理 JSX 和 TypeScript。