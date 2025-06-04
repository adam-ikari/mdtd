class TodoItemData:
    def __init__(self, text: str, checked: bool = False, fileLine: int = 0):
        self.text = text
        self.checked = checked
        self.fileline = fileLine
    def __repr__(self):
        return f"TodoItemData(text={self.text!r}, checked={self.checked!r}, fileLine={self.fileline!r})"