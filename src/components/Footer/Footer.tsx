import classNames from 'classnames';
import React from 'react';
import { FilterBy } from '../../types/FilterBy';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterBy: FilterBy,
  setFilterBy: (str: FilterBy) => void,
  removeTodo: (id: number) => void,
  todosActive: Todo[],
  todosCompleted: Todo[],
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  removeTodo,
  todosActive,
  todosCompleted,
}) => {
  const removeCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosActive.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === FilterBy.All,
            },
          )}
          onClick={() => setFilterBy(FilterBy.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === FilterBy.Active,
            },
          )}
          onClick={() => setFilterBy(FilterBy.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === FilterBy.Completed,
            },
          )}
          onClick={() => setFilterBy(FilterBy.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={removeCompletedTodos}
      >
        {!!todosCompleted.length && 'Clear completed'}
      </button>
    </footer>
  );
};
