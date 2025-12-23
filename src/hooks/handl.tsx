import { useState } from 'react';
import { Todo } from '../types/Todo';

type DeleteTodoFn = (id: number) => Promise<boolean>;
type OnErrorFn = (msg: string) => void;
type SetTodosFn = React.Dispatch<React.SetStateAction<Todo[]>>;

export function useTodoActions({
  deleteTodo,
  onError,
  setTodos,
}: {
  deleteTodo: DeleteTodoFn;
  onError: OnErrorFn;
  setTodos: SetTodosFn;
}) {
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const handleDelete = async (todoId: number) => {
    try {
      setLoadingTodoIds(prev =>
        prev.includes(todoId) ? prev : [...prev, todoId],
      );

      const deleteApproved = await deleteTodo(todoId);

      if (deleteApproved) {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      }
    } catch {
      onError('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearAll = async (completedTodos: number[]) => {
    try {
      setLoadingTodoIds(completedTodos);

      const deletionList = await Promise.allSettled(
        completedTodos.map(id => deleteTodo(id)),
      );

      const successIds = completedTodos
        .map((id, i) => (deletionList[i].status === 'fulfilled' ? id : null))
        .filter((id): id is number => id !== null);

      setTodos(prev => prev.filter(todo => !successIds.includes(todo.id)));

      const hasError = deletionList.some(item => item.status === 'rejected');

      if (hasError) {
        onError('Unable to delete a todo');
      }
    } catch {
      onError('Unable to delete a todo');
    } finally {
      setLoadingTodoIds([]);
    }
  };

  return { handleDelete, handleClearAll, loadingTodoIds };
}
