import classNames from 'classnames';
import React from 'react';
import { deleteTodo } from '../../../api/todos';
import { Filter, TypeChange } from '../../../context/TodoContext';
import { Todo } from '../../../types/Todo';

type Props = {
  todos: Todo[],
  filterState: Filter,
  handleFilter: (filterStatus: Filter, data: Todo[]) => void,
  setAllCompletedLoader: (value: boolean) => void,
  setTodos: (value: Todo[]) => void,
  handleStatusChange: (todo: Todo, type: TypeChange) => void,
  setErrorMessage: (value: string) => void,
  setLoadError: (value: boolean) => void,
};

export const FilterComponent: React.FC<Props> = ({
  todos,
  filterState,
  handleFilter,
  setAllCompletedLoader,
  setTodos,
  handleStatusChange,
  setErrorMessage,
  setLoadError,
}) => {
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

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
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
