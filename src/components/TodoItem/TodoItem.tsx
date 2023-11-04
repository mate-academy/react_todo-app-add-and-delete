import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

export type Props = {
  todo: Todo;
  isProcessed: boolean,
  onUpdate?: (todo: Todo) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete = () => Promise.resolve(),
  onUpdate = () => Promise.resolve(),
}) => {
  const field = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  useEffect(() => {
    if (field.current) {
      field.current.focus();
    }
  }, [editing]);

  function save() {
    if (isProcessed) {
      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle === todo.title) {
      setEditing(false);

      return;
    }

    if (trimmedTitle) {
      onUpdate({ ...todo, title: trimmedTitle })
        .then(() => setEditing(false))
        .catch(() => field.current?.focus());
    } else {
      onDelete()
        .then(() => setEditing(false))
        .catch(() => field.current?.focus());
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    save();
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            onUpdate({ ...todo, completed: !todo.completed })
              .catch(() => {});
          }}
        />
      </label>

      {editing ? (
        <form onSubmit={onSubmit}>
          <input
            data-cy="TodoTitleField"
            ref={field}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
            onChange={event => setTitle(event.target.value)}
            onBlur={save}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditing(false);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete().catch(() => {})}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
