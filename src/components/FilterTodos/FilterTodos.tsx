import React, { useCallback } from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  uncompletedCount: number;
  completedTodos: Todo[];
  filterType: FilterType;
  onFilter: (filterType: FilterType) => void;
  removeTodo: (id: number) => void;
};

export const FilterTodos: React.FC<Props> = ({
  uncompletedCount, completedTodos, filterType, onFilter, removeTodo,
}) => {
  const handleRemoveCompleted = useCallback(() => {
    completedTodos.map(todo => removeTodo(todo.id));
  }, []);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncompletedCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.ALL },
          )}
          onClick={() => onFilter(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.ACTIVE },
          )}
          onClick={() => onFilter(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.COMPLETED },
          )}
          onClick={() => onFilter(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
