import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoFilter } from '../types/TodoFilter';

interface FooterProps {
  todos: Todo[];
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoFilter).map(type => (
          <a
            key={type}
            href={`#/${type === TodoFilter.All ? '' : type}`}
            className={classNames('filter__link', {
              selected: filter === type,
            })}
            data-cy={`FilterLink${type}`}
            onClick={e => {
              e.preventDefault();
              onFilterChange(type);
            }}
          >
            {type}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
