import classNames from 'classnames';
import React, { memo } from 'react';
import { TodoCompleteStatus, Todo } from '../../types/Todo';
// eslint-disable-next-line import/no-cycle

export type Props = {
  todoFilterComplete: TodoCompleteStatus
  setTodoToComplete: (value: TodoCompleteStatus) => void
  completedTodos: () => void
  uncompletedTodos: Todo[]
  todoCompletedFiltered: Todo[]
};

export const Footer: React.FC<Props> = memo(({
  todoFilterComplete,
  setTodoToComplete,
  completedTodos,
  uncompletedTodos,
  todoCompletedFiltered,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: todoFilterComplete === TodoCompleteStatus.All },
          )}
          onClick={() => setTodoToComplete(TodoCompleteStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: todoFilterComplete === TodoCompleteStatus.Active },
          )}
          onClick={() => setTodoToComplete(TodoCompleteStatus.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: todoFilterComplete === TodoCompleteStatus.Completed },
          )}
          onClick={() => setTodoToComplete(TodoCompleteStatus.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={todoCompletedFiltered.length > 0
          ? 'todoapp__clear-completed'
          : 'todoapp__hidden'}
        onClick={completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
