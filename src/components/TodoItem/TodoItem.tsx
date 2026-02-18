import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: (id: number) => void;
  isLoader?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  isLoader = false,
}) => {
  const todoId = `todo-status-${todo.id}`;

  return (
    <div data-cy="Todo" className={`todo ${todo.completed && 'completed'}`}>
      <label className="todo__status-label" htmlFor={todoId}>
        <span className="is-hidden">Checkbox</span>
        <input
          id={todoId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            // May change checkbox on oposite
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        disabled={isLoader}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          onDelete(todo.id);
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoader && `is-active`}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
