import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface FooterProps {
  todos: Todo[],
  filterType: string,
  onFilterChange: (type: string) => void,
}

const Footer: React.FC<FooterProps>
= ({ todos, filterType, onFilterChange }) => {
  const filteredTodos = useMemo(() => {
    switch (filterType) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterType]);

  return (
    <>
      {filteredTodos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {filteredTodos.length}
            {filteredTodos.length === 1 ? ' item ' : ' items '}
            left
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={classNames(
                'filter__link', { selected: filterType === 'all' },
              )}
              onClick={() => onFilterChange('all')}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames(
                'filter__link', { selected: filterType === 'active' },
              )}
              onClick={() => onFilterChange('active')}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames(
                'filter__link', { selected: filterType === 'completed' },
              )}
              onClick={() => onFilterChange('completed')}
            >
              Completed
            </a>
          </nav>

          {todos.some((todo) => todo.completed) && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={() => {}}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};

export default Footer;
