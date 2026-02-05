import React from 'react';
import { Filter } from './Filter';
import classNames from 'classnames';
import { FilterType } from '../constants/filters';

interface FooterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todosLeft: number;
  onClearCompleted: () => void;
  hasCompletedTodos: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  filter,
  onFilterChange,
  todosLeft,
  onClearCompleted,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} item{todosLeft !== 1 ? 's' : ''} left
      </span>

      <Filter filter={filter} onFilterChange={onFilterChange} />

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'todoapp__clear-completed--disabled': !hasCompletedTodos,
        })}
        data-cy="ClearCompletedButton"
        onClick={hasCompletedTodos ? onClearCompleted : undefined}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
