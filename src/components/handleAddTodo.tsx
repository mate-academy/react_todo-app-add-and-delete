import { Todo } from '../types/Todo';
import { client as fetchClient } from '../utils/fetchClient';

type Props = {
  event: React.FormEvent;
  newTodo: string;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setCreatingId: React.Dispatch<React.SetStateAction<number | null>>;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setNewTodo: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

const USER_ID = 3381;

export const handleAddTodo = ({
  event,
  newTodo,
  setError,
  setErrorType,
  setTodos,
  setCreatingId,
  setIsSubmitting,
  setNewTodo,
  inputRef,
}: Props) => {
  event.preventDefault();
  if (!newTodo.trim()) {
    setError(true);

    setErrorType('empty');

    return;
  }

  const tempTodo = Date.now();
  const newTodoObj: Omit<Todo, 'id'> = {
    id: tempTodo,
    userId: USER_ID,
    title: newTodo.trim(),
    completed: false,
  };

  setTodos(prev => [...prev, newTodoObj]);
  setCreatingId(tempTodo);

  setIsSubmitting(true);

  /* eslint-disable */
  fetchClient
    .post<Omit<Todo, 'id'>>('/todos', {
      userId: USER_ID,
      title: newTodo.trim(),
      completed: false,
    })
    .then(createdTodo => {
      setTodos((prev: Todo[]) =>
        prev.map(t => (t.id === tempTodo ? createdTodo : t)),
      );
      setNewTodo('');
      setCreatingId(null);
    })
    .catch(() => {
      setTodos(prev => prev.filter(t => t.id !== tempTodo));
      setError(true);
      setErrorType('add');
      setCreatingId(null);
    })
    .finally(() => {
      setIsSubmitting(false);

      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    });
  /* eslint-enable */
};
