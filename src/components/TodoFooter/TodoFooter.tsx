import classNames from 'classnames';

import { useContext, useMemo } from 'react';

import { Status } from '../../types/Status';

import { TodoContext } from '../../context/TodoContext';

export const TodoFooter = () => {
  const {
    todos,
    status,
    setStatus,
    deleteCompletedTodos,
  } = useContext(TodoContext);

  const uncompletedTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const isCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      {/* Hide the footer if there are no todos */}
      <span className="todo-count">
        {`${uncompletedTodosCount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.All,
          })}
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.Active,
          })}
          onClick={() => setStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.Completed,
          })}
          onClick={() => setStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {isCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => deleteCompletedTodos(todos)}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
