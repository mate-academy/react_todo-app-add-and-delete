import React from 'react';
import { Filter } from './Filter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  incompleteCount: number;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  incompleteCount,
  hasCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {incompleteCount} item{incompleteCount !== 1 ? 's' : ''} left
      </span>

      <Filter filter={filter} setFilter={setFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
