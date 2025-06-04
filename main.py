from textual.app import App
from textual.binding import Binding
from components import TodoHeader, TodoFooter, TodoContent
from types_ import TodoItemData
from textual.reactive import reactive

TITLE = "TODO"




class TodoApp(App):
    CSS_PATH = "global.tcss"
    BINDINGS = [
        Binding(key="q", action="quit", description="Quit the app"),
        Binding(key="d", action="delete", description="Delete the thing"),
    ]
    
    # todos = reactive([TodoItemData("Dune", True, 1),
    #         TodoItemData("Dune Messiah", False, 2),
    #         TodoItemData("Children of Dune", False, 2),
    #         TodoItemData("God Emperor of Dune", False, 3),
    #         TodoItemData("Heretics of Dune", False, 4),
    #         TodoItemData("Chapterhouse: Dune", False, 5),
    #         TodoItemData("The Butlerian Jihad", False, 6),
    #         TodoItemData("The Machine Crusade", False, 7),
    #         TodoItemData("The Battle of Corrin", False, 8)])

    def on_mount(self) -> None:
        self.title = TITLE

    def compose(self):
        yield TodoHeader()
        yield TodoContent(id="todo-content")
        yield TodoFooter()

if __name__ == "__main__":
    app = TodoApp()
    app.run()
