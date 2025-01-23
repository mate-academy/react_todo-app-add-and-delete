import React from 'react';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  sortTodoBy: FilterType;
  onClick: (value: FilterType) => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  sortTodoBy,
  onClick,
  clearCompleted,
}) => {
  const visibileTodo = todos.filter(todo => !todo.completed);
  const disabledBtn = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {visibileTodo.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filterType => (
          <a
            key={filterType}
            href="#/"
            className={classNames('filter__link', {
              selected: sortTodoBy === filterType,
            })}
            data-cy={`FilterLink${filterType}`}
            onClick={() => onClick(filterType)}
          >
            {filterType}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!disabledBtn}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
