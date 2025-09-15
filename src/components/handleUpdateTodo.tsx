import { Todo } from '../types/Todo';
import { client as fetchClient } from '../utils/fetchClient';

type Props = {
  todo: Todo;
  newTitle: string;
  deleteTodo: (value: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditledTitle: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
};

export const handleUpdateTodo = ({
  todo,
  newTitle,
  deleteTodo,
  setTodos,
  setEditingId,
  setEditledTitle,
  setError,
  setErrorType,
}: Props) => {
  const trimmedTitle = newTitle.trim();

  if (!trimmedTitle) {
    deleteTodo(todo.id);

    return;
  }

  fetchClient
    .patch<Todo>(`/todos/${todo.id}`, { title: trimmedTitle })
    .then(updatedTodo => {
      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
      setEditingId(null);
      setEditledTitle('');
    })
    .catch(() => {
      setError(true);
      setErrorType('update');
    });
};
