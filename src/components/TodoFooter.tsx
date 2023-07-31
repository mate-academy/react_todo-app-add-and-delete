import classNames from 'classnames';
import { useMemo } from 'react';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { Error } from '../types/Error';

type Props = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  status: Status,
  setStatus: (status: Status) => void;
  setError: (value: Error) => void,
  setDeletingTodoIds: (ids: number[]) => void,
};

export const TodoFooter: React.FC<Props> = (
  {
    todos,
    setTodos,
    status,
    setStatus,
    setError,
    setDeletingTodoIds,
  },
) => {
  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodosCount = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const handleCompletedTodos = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingTodoIds(completedTodoIds);

    Promise.all(completedTodoIds.map(id => {
      return todoService.deleteTodo(id);
    }))
      .then(() => {
        const updatedTodos = todos.filter(todo => !todo.completed);

        setTodos(updatedTodos);
        setDeletingTodoIds([]);
      })
      .catch(() => {
        setError(Error.delete);
        setDeletingTodoIds([]);
      });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.all,
          })}
          onClick={() => setStatus(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.active,
          })}
          onClick={() => setStatus(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.completed,
          })}
          onClick={() => setStatus(Status.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: completedTodosCount === 0,
        })}
        onClick={handleCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
