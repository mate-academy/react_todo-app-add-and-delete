import React, { useMemo } from 'react';
import classNames from 'classnames';
import { StatusFilter } from '../../types/Filter';
import { Todo } from '../../types/Todo'

type Props = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  filter: StatusFilter,
  setFilter: (type: StatusFilter) => void,
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  filter,
  setTodos,
  setFilter,
}) => {
  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === StatusFilter.ALL },
          )}
          onClick={() => setFilter(StatusFilter.ALL)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === StatusFilter.ACTIVE },
          )}
          onClick={() => setFilter(StatusFilter.ACTIVE)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === StatusFilter.COMPLETED },
          )}
          onClick={() => setFilter(StatusFilter.COMPLETED)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>
      {activeTodosCount && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
