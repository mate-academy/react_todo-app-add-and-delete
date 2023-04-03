import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[],
  filter: (filter: Filter) => void
  removeCompletedTodos: () => void,
  currentFilter: Filter
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  removeCompletedTodos: removeCompleted,
  currentFilter,
}) => {
  const loadFilteringTodos = (isActive: boolean) => {
    if (!isActive) {
      filter(Filter.active);
    } else {
      filter(Filter.completed);
    }
  };

  const allTodo = () => {
    filter(Filter.all);
  };

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
          onClick={() => allTodo()}
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
          onClick={() => loadFilteringTodos(false)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            classNames(
              'filter__link', { selected: currentFilter === Filter.completed },
            )
          }
          onClick={() => loadFilteringTodos(true)}
        >
          Completed
        </a>
      </nav>

      {isCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={(event) => removeCompletedTodos(event)}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
