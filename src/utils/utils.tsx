import { Filter } from '../types/Filter';
import { TodoWithLoader } from '../types/TodoWithLoader';

export function filterTodos(todos: TodoWithLoader[], filter: Filter) {
  switch (filter) {
    case Filter.active:
      return todos.filter(todo => !todo.completed);
    case Filter.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export function completedTodos(todos: TodoWithLoader[]) {
  return todos.filter(todo => todo.completed);
}

export function updateTodoLoading(
  todo: TodoWithLoader,
  isLoading: boolean,
  setTodos: React.Dispatch<React.SetStateAction<TodoWithLoader[]>>,
  setUpdatedAt: (date: Date) => void,
) {
  setTodos(prevTodos => {
    const index = prevTodos.findIndex(todo1 => todo1.id === todo.id);
    const oldTodo = prevTodos[index];

    if (index >= 0) {
      setUpdatedAt(new Date());
      const newTodo: TodoWithLoader = { ...oldTodo, loading: isLoading };

      prevTodos.splice(index, 1, newTodo);
    }

    return prevTodos;
  });
}
