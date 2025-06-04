from textual.containers import VerticalScroll
from types_ import TodoItemData
from .TodoItem import TodoItem
from textual.reactive import reactive
from store.todos import use_todos

class TodoContent(VerticalScroll):
    todos = use_todos()
    
    def __init__(self, id: str):
        super().__init__(id=id)

    def compose(self):
        for index, item in enumerate(self.todos):
            yield TodoItem(label=item.text, value=item.checked, id=f"item_id_{index}")

    def on_mount(self):
        if len(self.todos) > 0:
            self.query_one("#item_id_0", TodoItem).focus()
            
    def on_checkbox_changed(self, event):
        item = event.checkbox
        index = int(item.id.split("_")[-1])
        self.todos[index].checked = item.value
        self.refresh()
