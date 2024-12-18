import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import React from 'react';
import { FilterEnum } from '../../utils/types';

type Props = {
  todosData: Todo[];
  filter: FilterEnum;
  setFilter: (filter: FilterEnum) => void;
  onClearClick: () => void;
  isDeleting: boolean;
};

export const Footer: React.FC<Props> = ({
  todosData,
  filter,
  setFilter,
  onClearClick,
  isDeleting,
}) => {
  return (
    <>
      {/* Hide the footer if there are no todos */}
      {todosData.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todosData.filter(todo => !todo.completed).length} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            {Object.values(FilterEnum).map(filterValue => (
              <a
                key={filterValue}
                href={`#/${filterValue.toLowerCase()}`}
                className={classNames('filter__link', {
                  selected: filter === filterValue,
                })}
                data-cy={`FilterLink${filterValue}`}
                onClick={() => setFilter(filterValue)}
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
            onClick={onClearClick}
            disabled={
              todosData.filter(todo => todo.completed).length === 0 ||
              isDeleting
            }
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
