import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[],
  setFilter: (filter: Filter) => void
  removeCompletedTodos: () => void,
  currentFilter: Filter
};

export const Footer: React.FC<Props> = ({
  todos,
  setFilter,
  removeCompletedTodos: removeCompleted,
  currentFilter,
}) => {
  const isCompletedTodos = todos.some(todo => todo.completed);

  const activeTodosCount = (
    todos.length - todos.filter(
      item => item.completed,
    ).length);

  const removeCompletedTodos = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    removeCompleted();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={
            classNames(
              'filter__link',
              { selected: currentFilter === Filter.all },
            )
          }
          onClick={() => setFilter(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            classNames(
              'filter__link',
              { selected: currentFilter === Filter.active },
            )
          }
          onClick={() => setFilter(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            classNames(
              'filter__link',
              { selected: currentFilter === Filter.completed },
            )
          }
          onClick={() => setFilter(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={(event) => removeCompletedTodos(event)}
        disabled={!isCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
