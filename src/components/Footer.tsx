import React from 'react';
import { Filter } from '../types/EnumFilter';
import classNames from 'classnames';

type Props = {
  filter: Filter[keyof Filter];
  onFilter: (filter: Filter) => void;
  completedTodosId: number[];
  todosActiveIds: number[];
  onDelete: (id: number) => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  onFilter,
  completedTodosId,
  todosActiveIds,
  onDelete,
}) => {
  const handleDeleteCompletedTodo = () => {
    completedTodosId.forEach(id => onDelete(id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosActiveIds.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterValue => (
          <a
            key={filterValue}
            href="#/"
            className={classNames('filter__link', {
              selected: filter === filterValue,
            })}
            data-cy={`FilterLink${filterValue}`}
            onClick={() => onFilter(filterValue)}
          >
            {filterValue}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosId.length}
        onClick={handleDeleteCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
