import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Params = {
  todoId: number;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setDeletingTodosIds: React.Dispatch<React.SetStateAction<number[]>>;
  setFocus: () => void;
};

export function deleteTodoItem({
  todoId,
  setTodos,
  setErrorMessage,
  setDeletingTodosIds,
  setFocus,
}: Params) {
  deleteTodo(todoId)
    .then(() => {
      setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));
    })
    .catch(() => {
      setErrorMessage('Unable to delete a todo');
    })
    .finally(() => {
      setDeletingTodosIds(prevIds => {
        return prevIds.filter(id => id !== todoId);
      });
      setFocus();
    });
}
