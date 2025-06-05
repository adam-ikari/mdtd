from textual.containers import VerticalScroll
from .TodoItem import TodoItem
from store.todos import use_todo_store


class TodoContent(VerticalScroll):
    todos_store = use_todo_store()
    def __init__(self, id: str):
        super().__init__(id=id)

    def compose(self):
        for item in self.todos_store.status:
            yield TodoItem(label=item.text, value=item.checked, id=f"todo_item_id_{item.id}", index=item.id)

    def on_mount(self):
        if len(self.todos_store.status) > 0:
            self.query_one(TodoItem).focus()

    def on_checkbox_changed(self, event):
        item = event.checkbox
        self.todos_store.status[item.index].checked = item.value
