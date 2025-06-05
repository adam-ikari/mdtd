from textual.reactive import reactive
from types_ import TodoItemData

todos: reactive[list[TodoItemData]] = reactive([
    TodoItemData(0, "twin", True, 1),
    TodoItemData(1, "Dune", True, 1),
    TodoItemData(2, "Dune Messiah", False, 2),
    TodoItemData(3, "Children of Dune", False, 2),
    TodoItemData(4, "God Emperor of Dune", False, 3),
    TodoItemData(5, "Heretics of Dune", False, 4),
    TodoItemData(6, "Chapterhouse: Dune", False, 5),
    TodoItemData(7, "The Butlerian Jihad", False, 6),
    TodoItemData(8, "The Machine Crusade", False, 7),
    TodoItemData(9, "The Battle of Corrin", False, 8)
])


def use_todos():
    global todos
    return todos
