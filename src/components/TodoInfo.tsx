import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoaderVisible: boolean;
  onDelete: (todoId: number) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoaderVisible,
  onDelete,
}) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [query, setQuery] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const todoContent = useMemo(() => (
    isEditing
      ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            onBlur={() => setIsEditing(false)}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )
  ), [onDelete]);

  return (
    <div className={classNames('todo', {
      completed: isCompleted,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() => {
            setIsCompleted(!isCompleted);
          }}
        />
      </label>

      <span className="todo__title">{todoContent}</span>

      <div className={classNames(
        'modal',
        'overlay', {
          'is-active': isLoaderVisible,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
