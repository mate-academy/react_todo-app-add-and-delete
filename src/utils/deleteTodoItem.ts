import { Dispatch, SetStateAction } from 'react';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export function deleteTodoItem(
  id: number,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setError: Dispatch<SetStateAction<string>>,
  setisLoadingId: Dispatch<SetStateAction<number | null>>,
) {
  if (setisLoadingId) {
    setisLoadingId(id);
  }

  deleteTodo(id)
    .then(() => {
      setTodos(currentToDos => currentToDos.filter(item => item.id !== id));
    })
    .catch(error => {
      setTodos(todos);
      setError('Unable to delete a todo');
      throw error;
    })
    .finally(() => {
      if (setisLoadingId) {
        setisLoadingId(null);
      }
    });
}
