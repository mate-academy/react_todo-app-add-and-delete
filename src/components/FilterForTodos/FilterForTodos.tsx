import React, { useMemo } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  filterBy: TodoStatus;
  setFilterBy: (filterBy: TodoStatus) => void;
  todos: Todo[];
  removeCompletedTodos: () => Promise<void>;
};

export const FilterForTodos: React.FC<Props> = React.memo(({
  filterBy, setFilterBy, todos, removeCompletedTodos,
}) => {
  const numberOfActive = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const hasCompletedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${numberOfActive} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link',
            { selected: filterBy === TodoStatus.ALL })}
          onClick={() => setFilterBy(TodoStatus.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            { selected: filterBy === TodoStatus.ACTIVE })}
          onClick={() => setFilterBy(TodoStatus.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: filterBy === TodoStatus.COMPLETED })}
          onClick={() => setFilterBy(TodoStatus.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: hasCompletedTodos ? 'visible' : 'hidden' }}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
