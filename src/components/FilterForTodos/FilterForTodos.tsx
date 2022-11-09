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
  filterBy,
  setFilterBy,
  todos,
  removeCompletedTodos,
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
        {Object.values(TodoStatus).map(status => (
          <a
            key={status}
            data-cy="FilterLinkAll"
            href="#/"
            className={cn('filter__link',
              { selected: filterBy === status })}
            onClick={() => setFilterBy(status)}
          >
            {status}
          </a>
        ))}
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
