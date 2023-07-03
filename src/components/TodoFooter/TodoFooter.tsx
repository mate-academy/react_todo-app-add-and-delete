import React, { useCallback } from 'react';
import { TodoFilter } from '../TodoFilter/TodoFilter';
import { TodoStatusFilter } from '../../types/TodoStatusFilter';
import { Todo } from '../../types/Todo';

type Props = {
  status: TodoStatusFilter,
  onSelectStatusFilter: (status: TodoStatusFilter) => void,
  uncompletedTodosCount: number,
  isVisibleClearCompleted: boolean,
  todos: Todo[],
  onRemoveTodo: (todoId: number) => void,
};

export const TodoFooter: React.FC<Props> = React.memo(({
  status,
  onSelectStatusFilter,
  uncompletedTodosCount,
  isVisibleClearCompleted,
  todos,
  onRemoveTodo,
}) => {
  const removeAllCompletedTodos = useCallback((todosFromServer: Todo[]) => {
    todosFromServer.forEach((todo) => {
      if (todo.completed) {
        onRemoveTodo(todo.id);
      }
    });
  }, todos);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncompletedTodosCount} items left`}
      </span>

      <TodoFilter
        status={status}
        onSelectStatusFilter={onSelectStatusFilter}
      />

      {isVisibleClearCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => removeAllCompletedTodos(todos)}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
