import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import {
  TODO_STATUS_FILTER_OPTIONS,
  TodoStatusFilter,
} from '../types/TodoStatusFilter';

interface TodoFilterProps {
  todos: Todo[];
  filter: TodoStatusFilter;
  someCompleted: boolean;
  setFilter: (newFilter: TodoStatusFilter) => void;
  onClearCompleted: () => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  todos,
  filter,
  someCompleted,
  setFilter,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} item{activeTodosCount !== 1 ? 's' : ''} left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(TODO_STATUS_FILTER_OPTIONS).map(
          ([option, { href, testId, text }]) => (
            <a
              key={testId}
              href={href}
              className={cn('filter__link', { selected: filter === option })}
              data-cy={testId}
              onClick={() => setFilter(option as TodoStatusFilter)}
            >
              {text}
            </a>
          ),
        )}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!someCompleted}
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
