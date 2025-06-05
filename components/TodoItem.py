from textual.widgets import Checkbox

class TodoItem(Checkbox):
    def __init__(self, label: str, value: bool, id: str, index: int):
        super().__init__(label=label, value=value, id=id)
        self.index = index