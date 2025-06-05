from textual.containers import VerticalScroll
from textual import on
from .TodoItem import TodoItem
from store.todos import use_todo_store
from textual.widgets import Checkbox

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

    def update_todo_status(self, index: int, completed: bool):
        """更新指定索引的Todo项状态"""
        self.todos_store.update_status(index, completed)

    def update_todo_text(self, index: int, new_text: str):
        """更新指定索引的Todo项文本"""
        self.todos_store.update_text(index, new_text)

    @on(Checkbox.Changed, "#todo-checkbox")
    def handle_checkbox_change(self, event: Checkbox.Changed):
        """处理复选框状态变化事件"""
        checkbox = event.checkbox
        if hasattr(checkbox.parent, "index"):
            self.update_todo_status(checkbox.parent.index, event.value)
