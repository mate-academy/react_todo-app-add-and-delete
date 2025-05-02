import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (todoId: number[]) => void;
  loading?: number;
};

export const TodoItem: React.FC<Props> = ({ todo, removeTodo, loading }) => {
  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : 'active'}`}
    >
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
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
        onClick={() => removeTodo([todo.id])}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      {loading && (
        <div
          data-cy="TodoLoader"
          className={`modal overlay ${loading ? 'is-active' : ''}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
