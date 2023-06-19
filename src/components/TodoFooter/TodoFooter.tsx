import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  filterOptions: string[];
  todos: Todo[];
  filter: string;
  changeFilter: (value: string) => void;
  clearCompletedTodos: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  filterOptions,
  todos,
  filter,
  changeFilter,
  clearCompletedTodos,
}) => {
  const leftTodos = todos.filter(todo => !todo.completed).length;

  const isComplited = todos.some(todo => todo.completed);

  const normalizeHref = (href: string) => `#/${href.toLowerCase()}`;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftTodos} items left`}
      </span>
      <nav className="filter">
        {filterOptions.map(option => (
          <a
            href={option === 'All' ? '#/' : normalizeHref(option)}
            key={option}
            className={classNames(
              'filter__link', {
                selected: filter === option,
              },
            )}
            onClick={() => {
              changeFilter(option);
            }}
          >
            {option}
          </a>
        ))}
      </nav>

      {isComplited && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
