import { Todo } from '../types/Todo';
import { client as fetchClient } from '../utils/fetchClient';

type Props = {
  todo: Todo;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
};

export const handleToggle = ({
  todo,
  setProcessingIds,
  setTodos,
  setError,
  setErrorType,
}: Props) => {
  setProcessingIds(prev => [...prev, todo.id]);

  fetchClient
    .patch<Todo>(`/todos/${todo.id}`, { completed: !todo.completed })
    .then(updatedTodo => {
      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    })
    .catch(() => {
      setError(true);
      setErrorType('update');
    })
    .finally(() => {
      setProcessingIds(prev => prev.filter(id => id !== todo.id));
    });
};
