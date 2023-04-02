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
  removeCompletedTodos: removeAll,
  currentFilter,
}) => {
  const loadFilteringTodos = (isActive: boolean) => {
    if (!isActive) {
      filter('active');
    } else {
      filter('completed');
    }
  };

  const allTodo = () => {
    filter('all');
  };

  const isCompletedTodos = todos.some(todo => todo.completed);
  const activeTodosCount = (
    todos.length - todos.filter(
      item => item.completed,
    ).length);
  const removeCompletedTodos = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    removeAll();

    return null;
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
            classNames('filter__link', { selected: currentFilter === 'all' })
          }
          onClick={() => allTodo()}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            classNames('filter__link', { selected: currentFilter === 'active' })
          }
          onClick={() => loadFilteringTodos(false)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            classNames(
              'filter__link', { selected: currentFilter === 'completed' },
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
