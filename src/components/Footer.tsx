import { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../contexts/TodoContext';
import { deleteTodo } from '../api/todos';
import { Filtering } from '../types/Filtering';

export const Footer = () => {
  const {
    todos,
    setTodos,
    filtering: status,
    setFiltering: setStatus,
    setLoading,
  } = useContext(TodoContext);

  const completedTodos = todos.filter(todo => todo.completed).map(t => t.id);

  const itemsLeft = todos.reduce((acc, t) => {
    if (!t.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const handleAllChange = useCallback(() => {
    setStatus(Filtering.ALL);
  }, []);

  const handleActiveChange = useCallback(() => {
    setStatus(Filtering.ACTIVE);
  }, []);

  const handleCompletedChange = useCallback(() => {
    setStatus(Filtering.COMPLETED);
  }, []);

  const handleDelete = useCallback((ids: number[]) => {
    Promise.all(ids.map(id => deleteTodo(id)))
      .then(() => {
        setTodos(prev => prev.filter(todo => !todo.completed));
      });

    setLoading(true);
  }, []);

  const hasCompleted = todos.some((t) => t.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: Filtering.ALL === status },
          )}
          data-cy="FilterLinkAll"
          onClick={handleAllChange}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: Filtering.ACTIVE === status },
          )}
          data-cy="FilterLinkActive"
          onClick={handleActiveChange}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: Filtering.COMPLETED === status },
          )}
          data-cy="FilterLinkCompleted"
          onClick={handleCompletedChange}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={() => handleDelete(completedTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
