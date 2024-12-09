import React from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/Status';

type Props = {
  todos: Todo[];
  status: TodoStatus;
  onStatusChange: (arg: TodoStatus) => void;
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  onStatusChange,
  clearCompletedTodos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const isAnyCompleted = todos.some(todo => todo.completed);
  const filterOptions = Object.values(TodoStatus);

  const capitalizeFirstLetter = (value: TodoStatus) => {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterOptions.map(option => {
          const formattedOption = capitalizeFirstLetter(option);

          return (
            <a
              href={option === 'all' ? '#/' : `#/${option}`}
              key={option}
              className={classNames('filter__link', {
                selected: status === option,
              })}
              data-cy={`FilterLink${formattedOption}`}
              onClick={() => onStatusChange(option)}
            >
              {formattedOption}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyCompleted}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
