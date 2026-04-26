import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { Selected } from '../types/enums/Selected';

type Props = {
  todos: Todo[];
  handleActiveTodosButton: () => void;
  handleCompletedTodosButton: () => void;
  handleAllTodosButton: () => void;
  handleAllActiveDelete: () => void;
  selected: Selected;
};

export const Footer: React.FC<Props> = ({
  todos,
  handleActiveTodosButton,
  handleCompletedTodosButton,
  handleAllTodosButton,
  handleAllActiveDelete,
  selected,
}) => {
  const [uncompletedTodosLength, setUncompletedTodosLength] = useState(
    todos.filter(todo => !todo.completed).length,
  );

  const [completedTodosLength, setCompletedTodosLength] = useState(
    todos.filter(todo => todo.completed).length,
  );

  useEffect(() => {
    setUncompletedTodosLength(todos.filter(todo => !todo.completed).length);
    setCompletedTodosLength(todos.filter(todo => todo.completed).length);
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodosLength} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          onClick={handleAllTodosButton}
          href="#/"
          className={cn('filter__link', {
            selected: selected === Selected.all,
          })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          onClick={handleActiveTodosButton}
          id="active_link"
          href="#/active"
          className={cn('filter__link', {
            selected: selected === Selected.active,
          })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          onClick={handleCompletedTodosButton}
          id="completed_link"
          href="#/completed"
          className={cn('filter__link', {
            selected: selected === Selected.completed,
          })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleAllActiveDelete}
        disabled={!completedTodosLength}
      >
        Clear completed
      </button>
    </footer>
  );
};
