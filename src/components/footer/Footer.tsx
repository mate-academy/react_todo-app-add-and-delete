import React from 'react';
import { Completed } from '../../types/Filters';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  filterParam: Completed;
  todos: Todo[];
  doneTask: boolean;
  onSetParam: (val: Completed) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterParam,
  todos,
  doneTask,
  onSetParam,
  onClearCompleted,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;

  const isHereCompleted = todos.some(todo => todo.completed);

  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodos} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={cn('filter__link', {
              selected: filterParam === Completed.All,
            })}
            data-cy="FilterLinkAll"
            onClick={() => onSetParam(Completed.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', {
              selected: filterParam === Completed.Active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => onSetParam(Completed.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: filterParam === Completed.Completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => onSetParam(Completed.Completed)}
          >
            Completed
          </a>
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={onClearCompleted}
          disabled={doneTask || !isHereCompleted}
          style={{ visibility: !isHereCompleted ? 'hidden' : 'visible' }}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
