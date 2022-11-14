import React, { useMemo } from 'react';
import classnames from 'classnames';
import { FilterTypes } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  getFilterTodo: (param: FilterTypes) => void;
  selectedTab: FilterTypes,
  deleteCompletedTodos: () => void,
  todos: Todo[],
};

export const Footer: React.FC<Props> = ({
  getFilterTodo,
  selectedTab,
  deleteCompletedTodos,
  todos,

}) => {
  const todoActive = useMemo(
    () => (todos.filter(todo => !todo.completed)
    ), [todos],
  );

  const todoCompletedLength = useMemo(
    () => (todos.filter(todo => todo.completed).length
    ), [todos],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todoActive.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classnames(
            'filter__link',
            {
              selected: selectedTab === FilterTypes.All,
            },
          )}
          onClick={() => getFilterTodo(FilterTypes.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classnames(
            'filter__link',
            {
              selected: selectedTab === FilterTypes.Active,
            },
          )}
          onClick={() => getFilterTodo(FilterTypes.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classnames(
            'filter__link',
            {
              selected: selectedTab === FilterTypes.Completed,
            },
          )}
          onClick={() => getFilterTodo(FilterTypes.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classnames(
          'todoapp__clear-completed',
        )}
        onClick={deleteCompletedTodos}
        disabled={!todoCompletedLength}
      >
        Clear completed
      </button>
    </footer>
  );
};
