import React from 'react';
import classNames from 'classnames';
import { FilterValues } from '../constants';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  selectedFilter: string;
  clearCompletedTodos: () => void;
  onChange: React.Dispatch<React.SetStateAction<FilterValues>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  selectedFilter,
  onChange,
  clearCompletedTodos,
}) => {
  const notCompletedTodos = [...todos].filter(todo => !todo.completed);
  const todosCountMessage = `${notCompletedTodos.length} items left`;
  const isClearCompletedDisabled = todos.length === notCompletedTodos.length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {todosCountMessage}
      </span>

      <nav className="filter">
        {Object.values(FilterValues).map((value) => (
          <a
            href="#/"
            key={value}
            className={classNames('filter__link', {
              selected: selectedFilter === value,
            })}
            onClick={() => onChange(value)}
          >
            {value}
          </a>
        ))}
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
