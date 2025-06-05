from textual.reactive import reactive
from textual.dom import DOMNode
from types_ import TodoItemData


class TodoStore(DOMNode):
    status = reactive([])

    def load(self, path):
        self.path = path
        """从指定路径加载todos"""
        try:
            with open(path, "r", encoding="utf-8") as f:
                lines = f.readlines()
                self.status = []
                for filelineno, line in enumerate(lines):
                    if line.startswith("- [x]"):
                        checked = True
                        text = line[6:].strip()
                    elif line.startswith("- [ ]"):
                        checked = False
                        text = line[6:].strip()
                    else:
                        continue
                    self.status.append(TodoItemData(
                        len(self.status), text=text, checked=checked, fileLine=filelineno))
        except Exception as e:
            print(f"加载todos失败: {e}")

    def save(self):
        """将todos保存为markdown格式"""
        if self.status is None:
            return

        try:
            with open(self.path, "w", encoding="utf-8") as f:
                f.write("# TODO List\n\n")
                for todo in self.status:
                    checked = "x" if todo.checked else " "
                    f.write(f"- [{checked}] {todo.text}\n")
        except Exception as e:
            print(f"保存todos到markdown失败: {e}")


todo_store = TodoStore()


def use_todo_store():
    return todo_store
