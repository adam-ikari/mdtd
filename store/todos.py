from textual.reactive import reactive
from types_ import TodoItemData

todos = reactive([TodoItemData("Dune", True, 1),
        TodoItemData("Dune Messiah", False, 2),
        TodoItemData("Children of Dune", False, 2),
        TodoItemData("God Emperor of Dune", False, 3),
        TodoItemData("Heretics of Dune", False, 4),
        TodoItemData("Chapterhouse: Dune", False, 5),
        TodoItemData("The Butlerian Jihad", False, 6),
        TodoItemData("The Machine Crusade", False, 7),
        TodoItemData("The Battle of Corrin", False, 8)])

def use_todos():
    global todos
    return todos