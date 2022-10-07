import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  filter: string,
  onSetFilter: (value: string) => void,
  ClearCompletedTodo: () => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  onSetFilter,
  ClearCompletedTodo,
}) => {
  const findCopletedTodo = todos.some(todo => todo.completed === true);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', { selected: filter === 'all' })}
          onClick={() => onSetFilter('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: filter === 'active' })}
          onClick={() => onSetFilter('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: filter === 'completed' })}
          onClick={() => onSetFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {findCopletedTodo && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={ClearCompletedTodo}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
