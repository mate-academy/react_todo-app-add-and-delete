import React, { useCallback } from 'react';
import classNames from 'classnames';
import { TypeFilter } from '../types/TypeFilter';

type Props = {
  filterBy: TypeFilter;
  setFilterBy: React.Dispatch<React.SetStateAction<TypeFilter>>;
  activeCount: number;
  hasCompleted: boolean;
  clearCompletedTodos: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  activeCount,
  hasCompleted,
  clearCompletedTodos,
}) => {
  const itemText = activeCount === 1 ? 'item' : 'items';

  const handleFilterClick = useCallback(
    (todoType: TypeFilter) => {
      setFilterBy(todoType);
    },
    [setFilterBy],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} {itemText} left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TypeFilter).map(todoType => (
          <a
            key={todoType}
            href={`#/${todoType}`}
            className={classNames('filter__link', {
              selected: todoType === filterBy,
            })}
            data-cy={`FilterLink${todoType}`}
            onClick={e => {
              e.preventDefault();
              handleFilterClick(todoType);
            }}
          >
            {todoType}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
