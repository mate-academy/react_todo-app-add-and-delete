import React from 'react';
import classNames from 'classnames';
import { filterValues } from '../constants';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<string>;
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  clearCompletedTodos,
}) => {
  const notCompletedTodos = [...todos].filter(todo => !todo.completed);
  const todosCountMessage = `${notCompletedTodos.length} items left`;
  const isClearCompletedDisabled = todos.length === notCompletedTodos.length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{todosCountMessage}</span>

      <nav className="filter">
        { Object.values(filterValues).map((value) => (
          <a
            href="#/"
            key={value}
            className={classNames('filter__link', {
              selected: selectedFilter === value,
            })}
            onClick={() => setSelectedFilter(value)}
          >
            {value}
          </a>
        )) }
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={isClearCompletedDisabled}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
