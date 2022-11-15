import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  isSelected: string;
  handleFilterButton: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  clearCompletedTodos: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  todos,
  isSelected,
  handleFilterButton,
  clearCompletedTodos,
}) => {
  const countUncompletedTodos = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${countUncompletedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { selected: isSelected === 'All' })}
          onClick={handleFilterButton}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: isSelected === 'Active' })}
          onClick={handleFilterButton}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: isSelected === 'Completed' })}
          onClick={handleFilterButton}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed',
          { hidden: !todos.some(todo => todo.completed) })}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
