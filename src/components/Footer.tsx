import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { FilterNav } from './FilterNav';

type Props = {
  activeCount: number;
  todos: Todo[];
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <FilterNav filter={filter} setFilter={setFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
