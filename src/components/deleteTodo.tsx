import { Todo } from '../types/Todo';
import { client as fetchClient } from '../utils/fetchClient';

type Props = {
  todoId: number;
  todos: Todo[];
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const deleteTodo = ({
  todoId,
  todos,
  setProcessingIds,
  setTodos,
  setError,
  setErrorType,
  inputRef,
}: Props) => {
  const delTodo = todos.find(t => t.id === todoId);

  if (!delTodo) {
    return;
  }

  setProcessingIds(prev => [...prev, todoId]);

  fetchClient
    .delete(`/todos/${todoId}`)
    .then(() => {
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    })
    .catch(() => {
      setError(true);
      setErrorType('delete');
    })
    .finally(() => {
      setProcessingIds(prev => prev.filter(id => id !== todoId));

      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    });
};
