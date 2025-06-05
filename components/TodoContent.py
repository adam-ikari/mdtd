from textual.containers import VerticalScroll
from .TodoItem import TodoItem
from store.todos import use_todos


class TodoContent(VerticalScroll):
    todos = use_todos()

    def __init__(self, id: str):
        super().__init__(id=id)

    def compose(self):
        for item in self.todos:
            yield TodoItem(label=item.text, value=item.checked, id=f"todo_item_id_{item.id}", index=item.id)

    def on_mount(self):
        if len(self.todos) > 0:
            self.query_one(TodoItem).focus()

    def on_checkbox_changed(self, event):
        item = event.checkbox
        self.todos[item.index].checked = item.value
