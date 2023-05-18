import classNames from 'classnames';
import React, { FC } from 'react';
import { Filters } from '../../types/Filters';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  category: Filters;
  onChange: (category: Filters) => void;
  removeTodo: (todoData: Todo) => void;
}

export const FooterTodoApp: FC<Props> = React.memo(({
  todos,
  category,
  onChange,
  removeTodo,
}) => {
  const leftItems = todos.filter(({ completed }) => completed === false).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftItems} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: category === Filters.All,
          })}
          onClick={() => onChange(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: category === Filters.Active,
          })}
          onClick={() => onChange(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: category === Filters.completed,
          })}
          onClick={() => onChange(Filters.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          notification: todos.length - leftItems <= 0,
          hidden: todos.length - leftItems <= 0,
        })}
        onClick={() => {
          todos
            .filter(({ completed }) => completed === true)
            .map(todo => removeTodo(todo));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
});
