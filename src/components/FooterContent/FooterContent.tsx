import classNames from 'classnames';
import React from 'react';
import { filterParams, TypeFilterParams } from '../../types/filterParams';

type Props = {
  countNotComplete: number;
  filterBy: TypeFilterParams;
  isCompleteTodo: boolean;
  onChangeFilterBy: (f: TypeFilterParams) => void;
  onDeleteCompletTodos: () => void;
};

export const FooterContent: React.FC<Props> = ({
  countNotComplete,
  filterBy,
  isCompleteTodo,
  onChangeFilterBy,
  onDeleteCompletTodos,
}) => {
  return (
    <>
      <span className="todo-count" data-cy="TodosCounter">
        {countNotComplete} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(filterParams).map(v => (
          <a
            key={v}
            href={`#/${v !== 'All' ? v.toLocaleLowerCase() : ''}`}
            className={classNames('filter__link', {
              selected: filterBy === v,
            })}
            data-cy={`FilterLink${v}`}
            onClick={() => onChangeFilterBy(v)}
          >
            {v}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompleteTodo}
        onClick={() => onDeleteCompletTodos()}
      >
        Clear completed
      </button>
    </>
  );
};
