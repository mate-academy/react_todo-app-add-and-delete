import { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoFilter } from './TodoFilter';
import { Status } from '../enums/Status';
import { deleteTodoItem } from '../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  status: Status;
  setStatus: (status: Status) => void;
  mainRef: React.RefObject<HTMLInputElement>;
  onError: (error: string) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  setTodos,
  status,
  setStatus,
  mainRef,
  onError,
}) => {
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);
  const count = useMemo(
    () => todos.filter(todo => todo.completed === false).length,
    [todos],
  );

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [isDeletingCompleted, mainRef]);

  const clearCompleted = () => {
    const completedDeletePromises = todos
      .filter(todo => todo.completed)
      .map(todo => deleteTodoItem(todo.id));

    setIsDeletingCompleted(true);
    Promise.allSettled(completedDeletePromises)
      .then(results => {
        setTodos(currentTodos => {
          const failedDeletions = results
            .map((result, index) => ({
              status: result.status,
              id: currentTodos.filter(todo => todo.completed)[index]?.id,
            }))
            .filter(result => result.status === 'rejected')
            .map(result => result.id);

          if (failedDeletions.length !== 0) {
            onError('Unable to delete a todo');
          }

          return currentTodos.filter(
            todo => !todo.completed || failedDeletions.includes(todo.id),
          );
        });
      })
      .finally(() => {
        setIsDeletingCompleted(false);
        setTimeout(() => onError(''), 3000);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {count} items left
      </span>

      <TodoFilter status={status} setStatus={setStatus} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
