import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter, TodoFilter } from '../TodoFilter/TodoFilter';

type Props = {
  todos: Todo[];
  filter: Filter;
  deletingTodoIds: Set<number>;
  isClearingCompleted: boolean;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  deletingTodoIds,
  isClearingCompleted,
  onClearCompleted,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const isDeletingCompleted = completedTodos.some(todo =>
    deletingTodoIds.has(todo.id),
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <TodoFilter filter={filter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={
          completedTodos.length === 0 ||
          isClearingCompleted ||
          isDeletingCompleted
        }
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
