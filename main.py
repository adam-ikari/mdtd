from textual.app import App
from textual.binding import Binding
from components import TodoHeader, TodoFooter, TodoContent
from store.todos import use_todo_store
from textual import events
import click

TITLE = "TODO"


class TodoApp(App):
    CSS_PATH = "global.tcss"
    BINDINGS = [
        Binding(key="q", action="quit", description="Quit the app"),
        Binding(key="d", action="delete", description="Delete the thing"),
        Binding(key="n", action="new", description="Create a new todo item"),
    ]

    todo_store = use_todo_store()

    def on_mount(self):
        self.title = TITLE

    def compose(self):
        yield TodoHeader()
        yield TodoContent(id="todo-content")
        yield TodoFooter()

    def on_key(self, event: events.Key) -> None:
        if event.key == "q":
            self.action_quit()
        elif event.key == "n":
            self.action_new()
        else:
            pass

    def action_quit(self):
        self.todo_store.save()
        self.exit()

    def action_new(self):
        """Create a new todo item."""
        self.todo_store.status.append(
            {"text": "new todo", "checked": False, "fileLine": -1}
        )
        self.query_one(TodoContent).refresh()

    def load(self, path: str):
        """Load todos from a file."""
        self.todo_store.load(path)

@click.command()
@click.argument("file")
def cli(file):
    """Run the TODO application."""
    try:
        app = TodoApp()
        app.load(file)
        app.run()
    except Exception as e:
        click.echo(f"Error: {e}", err=True)
        raise SystemExit(1)


if __name__ == "__main__":
    cli()
