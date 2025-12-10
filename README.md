# mdtd

A minimalist terminal UI todo app built with Ink and React

## Installation

```bash
npm install -g mdtd
```

Or use Bun:

```bash
bun add -g mdtd
```

Or use npx to run it directly:

```bash
npx mdtd
```

Or use bunx to run it directly:

```bash
bunx mdtd
```

## Usage

Run without arguments to create/open `todo.md`:

```bash
mdtd
```

Or specify a custom file:

```bash
mdtd filename.md
```

## Features

- **Minimalist Design**: Clean, simple interface focused on productivity
- **Pure Markdown**: Tasks stored in standard Markdown format for maximum compatibility
- **Task Hierarchy**: Support for nested tasks
- **Keyboard-First**: Vim-style navigation for efficient task management
- **Multi-language Support**: English and Chinese interface
- **Git-Friendly**: Plain text files work perfectly with version control

## Controls

- `j/k` or `↑/↓` - Navigate tasks
- `a` - Add new task
- `e` - Edit selected task
- `Space` - Toggle task completion
- `d` - Delete selected task
- `Shift+j/k` - Move task up/down
- `h/l` - Decrease/Increase task level
- `q` - Quit

## Markdown Format

Tasks are stored in standard Markdown checkbox format:

```markdown
# Tasks

- [ ] Parent task
  - [ ] Child task
    - [ ] Sub-child task
- [x] Completed task
```

## Development

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

3. Build the project:

   ```bash
   npm run build
   # or
   bun run build
   ```

4. Run the app:

   ```bash
   npm start
   # or for development with hot reload
   bun run dev
   ```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE.md)
