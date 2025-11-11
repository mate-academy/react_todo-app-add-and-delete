import React from 'react';
import cn from 'classnames';
import { Status, TODO_STATUS_FILTER_OPTIONS } from '../types/TodoStatusFilter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  selectedStatus: Status;
  setSelectedStatus: (status: Status) => void;
  handleDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  selectedStatus,
  setSelectedStatus,
  handleDeleteCompleted,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(TODO_STATUS_FILTER_OPTIONS).map(
          ([option, { href, testId, text }]) => (
            <a
              key={testId}
              href={href}
              className={cn('filter__link', {
                selected: selectedStatus === option,
              })}
              data-cy={testId}
              onClick={event => {
                event.preventDefault();
                setSelectedStatus(option as Status);
              }}
            >
              {text}
            </a>
          ),
        )}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
