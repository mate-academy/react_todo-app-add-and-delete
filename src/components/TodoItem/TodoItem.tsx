import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onTodoDelete: (value: number) => void,
}

export const TodoItem: React.FC<Props> = (
  {
    todo,
    onTodoDelete,
  },
) => {
  return (
    <div
      data-cy="Todo"
      className="todo"
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onTodoDelete(todo.id)}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
