from textual.app import App
from textual.widgets import Header, Checkbox, Footer
from textual.widgets._toggle_button import ToggleButton
from textual.containers import VerticalScroll
from textual.binding import Binding

TITLE = "TODO"


class TodoItemData:
    def __init__(self, text: str, checked: bool = False, fileLine: int = 0):
        self.text = text
        self.checked = checked
        self.fileline = fileLine


data = [
    TodoItemData("Dune", True, 1),
    TodoItemData("Dune Messiah", False, 2),
    TodoItemData("Children of Dune", False, 2),
    TodoItemData("God Emperor of Dune", False, 3),
    TodoItemData("Heretics of Dune", False, 4),
    TodoItemData("Chapterhouse: Dune", False, 5),
    TodoItemData("The Butlerian Jihad", False, 6),
    TodoItemData("The Machine Crusade", False, 7),
    TodoItemData("The Battle of Corrin", False, 8)]


class TodoItem(Checkbox):
    def _on_mount(self):
        pass


class TodoContext(VerticalScroll):
    def compose(self):
        for index, item in enumerate(data):
            yield TodoItem(item.text, item.checked, id=f"item_id_{index}")

    def on_mount(self):
        pass
        self.query_one("#item_id_0", Checkbox).focus()


class TodoApp(App):
    CSS_PATH = "global.tcss"
    BINDINGS = [
        Binding(key="q", action="quit", description="Quit the app"),
        Binding(key="d", action="delete", description="Delete the thing"),
    ]

    def on_mount(self) -> None:
        self.title = TITLE

    def compose(self):
        yield Header()
        yield TodoContext()
        yield Footer()


if __name__ == "__main__":
    app = TodoApp()
    app.run()
