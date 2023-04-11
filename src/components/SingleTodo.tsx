import React, { useState } from 'react';
import classNames from 'classnames';
import { ColorRing } from 'react-loader-spinner';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  onDelete: (todoId: number) => Promise<void>,
  inLoading: boolean,
}

export const SingleTodo: React.FC<Props> = ({
  todo,
  onDelete,
  inLoading,
}) => {
  const [isComplited, setComplited] = useState(todo.completed);

  const changeCheck = () => {
    setComplited(prev => !prev);
  };

  return (
    <div
      key={todo.id}
      className={classNames(
        'todo',
        { completed: isComplited },
      )}
    >
      {!inLoading
        ? (
          <>
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={isComplited}
                onChange={changeCheck}
              />
            </label>

            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(todo.id)}
            >
              x
            </button>

            {/* overlay will cover the todo while it is being updated */}
            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )
        : (
          <ColorRing
            visible
            height="50"
            width="50"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
        )}
    </div>
  );
};
