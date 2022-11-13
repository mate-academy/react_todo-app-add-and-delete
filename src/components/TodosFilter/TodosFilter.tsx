import React, { useMemo } from 'react';

import { TodoCount } from '../TodoCount';
import { TodosFilterNav } from '../TodosFilterNav';

import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';

interface Props {
  todos: Todo[];
  filterBy: FilterStatus;
  onFilter: (filterType: FilterStatus) => void;
  onDeleteAllTodos: () => void;
}

export const TodosFilter: React.FC<Props> = ({
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
      <TodoCount todosLeft={todosLeft} />

      <TodosFilterNav filterBy={filterBy} onFilter={onFilter} />

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
