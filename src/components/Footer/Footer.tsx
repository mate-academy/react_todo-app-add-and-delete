import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  filterBy: (filterType: FilterType) => void;
  filterType: FilterType;
  todos: Todo[];
  removeCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  filterBy,
  filterType,
  todos,
  removeCompletedTodos,
}) => {
  const isSomeTodoDone = todos.some((todo) => todo.completed);
  const activeTodosCount = todos.filter((todo) => !todo.completed).length;

  const handleFiltering = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const newFilterType = event.currentTarget.dataset.sort as FilterType;

    filterBy(newFilterType);
  };

  const handleClearCompleted = () => {
    removeCompletedTodos();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${activeTodosCount} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          data-sort={FilterType.All}
          onClick={handleFiltering}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          data-sort={FilterType.Active}
          onClick={handleFiltering}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          data-sort={FilterType.Completed}
          onClick={handleFiltering}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: isSomeTodoDone ? 'visible' : 'hidden' }}
        disabled={!isSomeTodoDone}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
