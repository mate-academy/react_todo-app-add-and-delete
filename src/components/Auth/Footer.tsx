import React from 'react';
import { Navigation } from './Navigation';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  filter: Filter;
  setFilter: (arg: Filter) => void;
  todos: Todo[];
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = React.memo(({
  filter,
  setFilter,
  todos,
  deleteCompletedTodos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <Navigation filter={filter} setFilter={setFilter} />
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodos.length === 0}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
