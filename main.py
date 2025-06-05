from textual.app import App
from textual.binding import Binding
from components import TodoHeader, TodoFooter, TodoContent

TITLE = "TODO"


class TodoApp(App):
    CSS_PATH = "global.tcss"
    BINDINGS = [
        Binding(key="q", action="quit", description="Quit the app"),
        Binding(key="d", action="delete", description="Delete the thing"),
    ]

    def on_mount(self):
        self.title = TITLE

    def compose(self):
        yield TodoHeader()
        yield TodoContent(id="todo-content")
        yield TodoFooter()


if __name__ == "__main__":
    app = TodoApp()
    app.run()
