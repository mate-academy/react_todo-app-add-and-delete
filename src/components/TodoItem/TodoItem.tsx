import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

import { updateTodo } from '../../api/todos';

interface Props {
  todo?: Partial<Todo> | null;
  isProcessed: boolean;
  onDelete?: () => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
}) => {
  const handleToggleChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    idToUpdate: number | undefined,
  ) => {
    const { target } = event;
    const { checked } = target;

    if (idToUpdate) {
      updateTodo(idToUpdate, { completed: checked });
    }
  };

  return (
    <div className={
      classNames(
        'todo',
        { completed: todo?.completed },
      )
    }
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          onChange={(event) => handleToggleChecked(event, todo?.id)}
        />
      </label>

      <span className="todo__title">{todo?.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={onDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      {isProcessed && (
        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
