# mdtd

基于 Ink 和 React 构建的极简终端待办事项应用

## 安装

```bash
npm install -g mdtd
```

或使用 Bun：

```bash
bun add -g mdtd
```

或使用 npx 直接运行：

```bash
npx mdtd
```

或使用 bunx 直接运行：

```bash
bunx mdtd
```

## 使用

不带参数运行，创建或打开 `todo.md`：

```bash
mdtd
```

或指定自定义文件：

```bash
mdtd filename.md
```

## 特性

- **极简设计**：简洁、专注生产力的界面
- **纯 Markdown**：任务以标准 Markdown 格式存储，最大兼容性
- **任务层级**：支持嵌套任务
- **键盘优先**：Vim 风格导航，高效任务管理
- **多语言支持**：中英文界面
- **Git 友好**：纯文本文件完美支持版本控制

## 快捷键

- `j/k` 或 `↑/↓` - 导航任务
- `a` - 添加新任务
- `e` - 编辑选中任务
- `空格` - 切换任务完成状态
- `d` - 删除选中任务
- `Shift+j/k` - 上下移动任务
- `h/l` - 减少/增加任务层级
- `q` - 退出

## Markdown 格式

任务以标准 Markdown 复选框格式存储：

```markdown
# 任务列表

- [ ] 父任务
  - [ ] 子任务
    - [ ] 子子任务
- [x] 已完成任务
```

## 开发

1. 克隆仓库
2. 安装依赖：

   ```bash
   npm install
   # 或
   bun install
   ```

3. 构建项目：

   ```bash
   npm run build
   # 或
   bun run build
   ```

4. 运行应用：

   ```bash
   npm start
   # 或开发模式（热重载）
   bun run dev
   ```

## 贡献

欢迎提交 Pull Request。重大修改请先开 Issue 讨论。

## 许可证

[MIT](LICENSE.md)
