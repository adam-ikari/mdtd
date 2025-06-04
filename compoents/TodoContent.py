from textual.containers import VerticalScroll
from types_ import TodoItemData
from . import TodoItem

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

class TodoContent(VerticalScroll):
    # def __init__(self, id, data: list[TodoItemData] = []):
    #     super().__init__(id=id)
    #     self._data = data

    def compose(self):
        for index, item in enumerate(data):
            yield TodoItem(item.text, item.checked, id=f"item_id_{index}")

    def on_mount(self):
        self.query_one("#item_id_0", TodoItem).focus()
