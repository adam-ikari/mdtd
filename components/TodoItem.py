from textual.widget import Widget
from textual.widgets import Checkbox, Input
from textual.reactive import reactive
from textual import events, on
from textual.css.query import NoMatches

class TodoItem(Widget):
    # DEFAULT_CSS = """
    # TodoItem {
    #     height: 1;
    #     margin: 1 0;
    #     border: none;
    # }
    # """
    # """重构后的TodoItem组件，组合Checkbox和Input"""
    is_editing = reactive(False)
    index = reactive(0)
    label = reactive("")
    completed = reactive(False)

    def __init__(self, label: str, completed: bool = False, value: bool = None, index: int = 0, id: str = None):
        super().__init__(id=id)
        self.original_label = label
        self.label = label
        self.completed = completed or (value if value is not None else False)
        self.index = index

    def compose(self):
        """组合Checkbox和Input组件"""
        yield Checkbox(self.label, value=self.completed, id="todo-checkbox")
        yield Input(self.label, id="todo-input", classes="hidden")

    def on_mount(self):
        """初始化组件状态"""
        self.query_one("#todo-input", Input).display = False

    @on(Checkbox.Changed, "#todo-checkbox")
    def handle_checkbox_change(self, event: Checkbox.Changed):
        """处理复选框状态变化"""
        self.completed = event.value
        self.parent.update_todo_status(self.index, self.completed)

    @on(Input.Submitted, "#todo-input")
    def handle_input_submit(self, event: Input.Submitted):
        """处理输入框提交"""
        new_text = event.value.strip()
        if new_text and new_text != self.original_label:
            self.label = new_text
            self.original_label = new_text
            self.query_one("#todo-checkbox", Checkbox).label = new_text
            self.parent.update_todo_text(self.index, new_text)
        self.toggle_edit()

    def toggle_edit(self):
        """切换编辑状态"""
        self.is_editing = not self.is_editing
        checkbox = self.query_one("#todo-checkbox", Checkbox)
        input_field = self.query_one("#todo-input", Input)

        if self.is_editing:
            checkbox.display = False
            input_field.display = True
            input_field.value = self.label
            input_field.focus()
        else:
            checkbox.display = True
            input_field.display = False

    def on_click(self, event: events.Click):
        """处理点击事件"""
        if not self.is_editing:
            self.toggle_edit()
        event.stop()

    def on_key(self, event: events.Key):
        """处理键盘事件"""
        if self.is_editing:
            if event.key == "escape":
                self.toggle_edit()
                event.stop()
            elif event.key == "enter":
                input_field = self.query_one("#todo-input", Input)
                input_field.post_message(Input.Submitted(input_field, input_field.value))
                event.stop()

    def on_blur(self):
        """处理失去焦点事件"""
        if self.is_editing:
            self.toggle_edit()
