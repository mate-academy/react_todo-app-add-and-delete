import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Context } from '../../context';

type Props = {
  todo: Todo,
  isUpdating: boolean,
};

export const TodoInfo: React.FC<Props> = React.memo(
  ({
    todo,
    isUpdating,
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const { onDelete } = useContext(Context);

    const { title, completed } = todo;

    return (
      <div className={classNames('todo', {
        completed,
      })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
          />
        </label>

        {isEditing ? (
          <form onSubmit={() => setIsEditing(false)}>
            <input
              type="text"
              className="todo__title-field"
              placeholder={title}
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(!isEditing)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>

        )}

        <div className={classNames('modal', 'overlay', {
          'is-active': isUpdating,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
