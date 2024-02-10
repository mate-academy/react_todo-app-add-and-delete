import React from 'react';
import { FilterComponent } from './Filter';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

type Props = {
  todos: Todo[],
  filterType: FilterType;
  filterChange: (filter: FilterType) => void;
};

export const Footer: React.FC<Props>
= ({ todos, filterType, filterChange }) => {
  const incompleteTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${incompleteTodosCount} items left`}
      </span>

      <FilterComponent filterChange={filterChange} filterType={filterType} />

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
