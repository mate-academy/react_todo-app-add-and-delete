import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null | undefined;
  deletingIds: number[];
  deleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  deletingIds,
  deleteTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {visibleTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        deletingIds={deletingIds}
      />
    ))}
    {tempTodo && (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            disabled
            aria-label="Toggle todo status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo.title}
        </span>

        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
