import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  isLoading?: boolean,
  updateLoading: React.Dispatch<React.SetStateAction<boolean>>,
  updateError: React.Dispatch<React.SetStateAction<string>>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  updateLoading,
  updateError,
}) => {
  const [isEdit] = useState(false);

  const handleStatus = () => {};

  const handleDelete = () => {
    updateLoading(true);

    deleteTodo(todo.id)
      .catch(() => updateError('Unable to delete a todo'))
      .finally(() => updateLoading(false));
  };

  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatus}
        />
      </label>

      {isEdit
        ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        ) : (
          <>
            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleDelete}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
