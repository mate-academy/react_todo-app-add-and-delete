import React from 'react';
import { Todo } from '../../types/Todo';
import { useTodos } from '../Context';

export const TodoItem: React.FC<Todo> = (todo: Todo) => {
  const { deleteTodo, loadingTodoId } = useTodos();

  const { completed, id } = todo;

  const isLoading = id === loadingTodoId;

  return (
    <div
      data-cy="Todo"
      className={`todo ${completed ? 'completed' : 'item-enter-done'}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        x
      </button>

      <div data-cy="TodoLoader" className={`modal overlay ${isLoading && 'is-active'}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
