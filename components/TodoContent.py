from textual.containers import VerticalScroll
from types_ import TodoItemData
from .TodoItem import TodoItem

class TodoContent(VerticalScroll):
    def __init__(self, id: str, data: list[TodoItemData]):
        super().__init__(id=id)
        self.__data = data
    def compose(self):
        for index, item in enumerate(self.__data):
            yield TodoItem(label=item.text, value=item.checked, id=f"item_id_{index}")

    def on_mount(self):
        if len(self.__data) > 0:
            self.query_one("#item_id_0", TodoItem).focus()
