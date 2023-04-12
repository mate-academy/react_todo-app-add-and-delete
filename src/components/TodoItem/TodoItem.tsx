import React from 'react';
import { Todo } from '../../types/Todo';

import { deleteTodo, updateTodo } from '../../api/todos';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({
  todo,
}) => {
  const { completed, title, id } = todo;

  const handleToggleChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    idToUpdate: number,
  ) => {
    const { target } = event;
    const { checked } = target;

    updateTodo(idToUpdate, { completed: !checked });
  };

  return (
    <div className={`todo ${completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={(event) => handleToggleChecked(event, id)}
        />
      </label>

      <span className="todo__title">{title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
