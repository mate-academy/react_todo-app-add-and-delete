import React from 'react';
import { Filter } from './Filter';
import { FilterType } from '../types/filterType';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  itemsLeft: number;
  filterType: string;
  onFilterClick: (type: FilterType) => void;
  completedTodos: Todo[];
  onDeleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  filterType,
  onFilterClick,
  completedTodos,
  onDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <Filter filterType={filterType} onFilterClick={onFilterClick} />

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className={classNames('todoapp__clear-completed')}
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={onDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
