import { client as fetchClient } from '../utils/fetchClient';

type Props = {
  list: Todo[];
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorType: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const handleDelete = ({
  list,
  setProcessingIds,
  setTodos,
  setError,
  setErrorType,
  inputRef,
}: Props) => {
  if (list.length === 0) {
    return;
  }

  const listOfClear =
    list.length === 1 ? [...list] : list.filter(t => t.completed);

  setProcessingIds(prev => [...prev, ...listOfClear.map(t => t.id)]);

  Promise.allSettled(
    listOfClear.map(todo =>
      fetchClient
        .delete(`/todos/${todo.id}`)
        .then(() => ({ todo, success: true }))
        .catch(() => ({ todo, success: false })),
    ),
  )
    .then(results => {
      const failedIds = results
        .filter(r => r.status === 'fulfilled' && !r.value.success)
        .map(r => r.value.todo.id);

      setTodos(prev =>
        prev.filter(
          t =>
            !listOfClear.some(c => c.id === t.id) || failedIds.includes(t.id),
        ),
      );

      if (failedIds.length > 0) {
        setError(true);
        setErrorType('delete');
      }
    })
    .finally(() => {
      setProcessingIds(prev =>
        prev.filter(id => !listOfClear.some(t => t.id === id)),
      );

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    });
};
