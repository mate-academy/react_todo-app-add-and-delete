import classNames from 'classnames';
import React, { memo } from 'react';
import { FilterTodoComplete, Todo } from '../../types/Todo';
// eslint-disable-next-line import/no-cycle

export type Props = {
  todoCompleted: FilterTodoComplete
  setTodoToComplete: (value: FilterTodoComplete) => void
  listTodoCompletedToDelete: Todo[]
  deleteTodosStatusCompleted: () => void
  countNotCompletedTodo: Todo[]
};

export const TodoFooter: React.FC<Props> = memo(({
  todoCompleted,
  setTodoToComplete,
  listTodoCompletedToDelete,
  deleteTodosStatusCompleted,
  countNotCompletedTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${countNotCompletedTodo.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: todoCompleted === FilterTodoComplete.All },
          )}
          onClick={() => setTodoToComplete(
            (FilterTodoComplete.All),
          )}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: todoCompleted === FilterTodoComplete.Active },
          )}
          onClick={() => setTodoToComplete(
            (FilterTodoComplete.Active),
          )}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: todoCompleted === FilterTodoComplete.Completed },
          )}
          onClick={() => setTodoToComplete(
            (FilterTodoComplete.Completed),
          )}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={listTodoCompletedToDelete.length > 0
          ? 'todoapp__clear-completed'
          : 'todoapp__hidden'}
        onClick={deleteTodosStatusCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
});
