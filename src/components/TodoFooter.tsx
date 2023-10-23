import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoFilter } from '../types/TodoFilter';
import { TodoContext } from '../Context/TodoContext';

type Props = {
  filter: TodoFilter;
  setFilter: (newFilter: TodoFilter) => void;
};

export const TodoFooter: React.FC<Props> = ({
  filter,
  setFilter,
}) => {
  const {
    activeTodos,
    completedTodos,
    clearCompleted,
  } = useContext(TodoContext);

  const activeTodosCount = activeTodos.length;
  const completedTodosCount = completedTodos.length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.keys(TodoFilter).map((filterName) => (
          <a
            key={filterName}
            href={`#/${filterName}`}
            className={classNames('filter__link', {
              selected: filterName === filter,
            })}
            data-cy={`FilterLink${filterName}`}
            onClick={() => setFilter(filterName as TodoFilter)}
          >
            {filterName}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        style={{ visibility: completedTodos.length ? 'visible' : 'hidden' }}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
