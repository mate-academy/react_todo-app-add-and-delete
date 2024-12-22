import React from 'react';
import { Filter } from './Filter';
import { Todo } from '../types/Todo';
import { getCompletedTodos } from '../utils/methods';

interface Props {
  sizeLeft: number;
  filter: string;
  onFilter: (v: string) => void;
  onClear: () => void;
  todos: Todo[];
}

export const Footer: React.FC<Props> = ({
  sizeLeft,
  filter,
  onFilter,
  onClear,
  todos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${sizeLeft} items left`}
      </span>

      <Filter onFilter={onFilter} filter={filter} />

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={getCompletedTodos(todos).length === 0}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
