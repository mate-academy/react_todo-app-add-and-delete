import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { StatusFilter} from '../../types/Filter';

type Props = {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  filter: StatusFilter
  setFilter: (item: StatusFilter) => void
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  setTodos,
  filter,
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

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === StatusFilter.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(StatusFilter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === StatusFilter.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(StatusFilter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === StatusFilter.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(StatusFilter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
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