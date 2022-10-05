import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import { deleteTodo } from '../../../api/todos';
import { TypeChange } from '../../../types/TypeChange';
import { Filter } from '../../../types/Filter';
import { TodoContext } from '../../../context/TodoContext';

export const FilterComponent: React.FC = () => {
  const {
    todos,
    filterState,
    handleFilter,
    setAllCompletedLoader,
    setTodos,
    handleStatusChange,
    setErrorMessage,
    setLoadError,
  } = useContext(TodoContext);

  const deleteAllClearFromServer = async () => {
    try {
      setAllCompletedLoader(true);
      await Promise.all(
        todos.map(async (todo) => {
          if (todo.completed) {
            await deleteTodo(todo.id);
          }
        }),
      );
      todos.map(todo => handleStatusChange(todo, TypeChange.deleteAll));
    } catch (_) {
      setLoadError(true);
      setErrorMessage('Unable to delete completed todos from server');
    } finally {
      setAllCompletedLoader(false);
    }
  };

  const handleClearAllCompleted = () => {
    deleteAllClearFromServer();
    setTodos(todos);
  };

  const activeCounter = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeCounter} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filterState === Filter.all,
            },
          )}
          onClick={() => handleFilter(Filter.all, todos)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filterState === Filter.active,
            },
          )}
          onClick={() => handleFilter(Filter.active, todos)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filterState === Filter.completed,
            },
          )}
          onClick={() => handleFilter(Filter.completed, todos)}
        >
          Completed
        </a>
      </nav>

      {todos.some(todo => todo.completed) && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearAllCompleted}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
