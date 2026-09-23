import React from 'react';
import { Filters } from '../../types/Filters';
import { Filter } from '../Filter/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  uncompletedTodos: Todo[];
  completedTodos: Todo[];
  filterBy: (filterCriteria: Filters) => void;
  onClear: () => void;
};

export const Footer = ({
  uncompletedTodos,
  completedTodos,
  filterBy,
  onClear,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodos.length} items left
      </span>

      <Filter filterBy={filterBy} />
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
