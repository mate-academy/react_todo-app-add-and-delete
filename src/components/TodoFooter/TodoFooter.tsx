import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  filterTodos: Todo[],
  filterTodo: string,
  setFilterTodo: (parameter: string) => void,
  completedTodos: Todo[],
};

export const TodoFooter: React.FC<Props> = ({
  filterTodos,
  filterTodo,
  setFilterTodo,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${filterTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterTodo === 'all' },
          )}
          onClick={() => setFilterTodo('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterTodo === 'active' },
          )}
          onClick={() => setFilterTodo('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterTodo === 'completed' },
          )}
          onClick={() => setFilterTodo('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        {completedTodos.length === 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
