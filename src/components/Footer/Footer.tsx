import React, { useMemo } from 'react';

import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { Navigation } from '../Navigation/Navigation';

type Props = {
  todos: Todo[];
  filterBy: FilterType;
  onFilter: (filterType: FilterType) => void;
  onDeleteAllTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  onFilter,
  onDeleteAllTodos,
}) => {
  const hasCompletedTodo = useMemo(
    () => todos.some(todo => todo.completed), [],
  );
  const todosLeft = useMemo(
    () => todos.filter(todo => !todo.completed).length, [],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <Navigation filterBy={filterBy} onFilter={onFilter} />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: hasCompletedTodo ? 'visible' : 'hidden' }}
        onClick={onDeleteAllTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
