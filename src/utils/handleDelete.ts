import { deleteTodo } from '../api/todos';
import { errorText } from '../constants';
import { TodoWithLoader } from '../types/TodoWithLoader';
import { updateTodoLoading } from './utils';

export function handleDelete(
  todo: TodoWithLoader,
  setTodos: React.Dispatch<React.SetStateAction<TodoWithLoader[]>>,
  setErrorMessage: (errorMessage: string) => void,
  setUpdatedAt: (date: Date) => void,
) {
  updateTodoLoading(todo, true, setTodos, setUpdatedAt);

  return deleteTodo(todo.id)
    .then(() => {
      setTodos(oldTodos => {
        return oldTodos.filter(oldTodo => oldTodo.id !== todo.id);
      });
    })
    .catch(error => {
      updateTodoLoading(todo, false, setTodos, setUpdatedAt);
      setErrorMessage(errorText.failDeleting);
      setUpdatedAt(new Date());
      throw error;
    });
}
