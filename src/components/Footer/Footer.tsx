import cn from 'classnames';
import { FilterTypes } from '../../types/FilterTypes';
import React from 'react';

interface Props {
  unfinishedTodoAmount: number;
  setFilterInstructions: (filterType: FilterTypes) => void;
  filterInstructions: FilterTypes;
  completedTodosIds: number[];
  onDeleteTodo: (ids: number[]) => void;
}

export const Footer: React.FC<Props> = ({
  unfinishedTodoAmount,
  setFilterInstructions,
  filterInstructions,
  completedTodosIds,
  onDeleteTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {unfinishedTodoAmount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterTypes).map((type: FilterTypes) => {
          return (
            <a
              key={type}
              href={type === FilterTypes.All ? '#/' : '#/' + type.toLowerCase()}
              className={cn('filter__link', {
                selected: filterInstructions === type,
              })}
              data-cy={`FilterLink${type}`}
              onClick={() => setFilterInstructions(type)}
            >
              {type}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosIds.length}
        onClick={() => onDeleteTodo(completedTodosIds)}
      >
        Clear completed
      </button>
    </footer>
  );
};
