import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[],
  filterBy: Filter,
  onChangeFilter: (filterBy: Filter) => void,
  onDeleteCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  onChangeFilter,
  onDeleteCompletedTodos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === Filter.All,
            },
          )}
          onClick={() => {
            onChangeFilter(Filter.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === Filter.Active,
            },
          )}
          onClick={() => {
            onChangeFilter(Filter.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === Filter.Completed,
            },
          )}
          onClick={() => {
            onChangeFilter(Filter.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {completedTodos ? (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onDeleteCompletedTodos}
        >
          Clear completed
        </button>

      ) : (
        <button
          type="button"
          className="todoapp__clear-completed"
          style={{ opacity: 0, cursor: 'auto' }}
          disabled
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
