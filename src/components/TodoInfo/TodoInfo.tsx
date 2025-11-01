/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Partial<Todo>;
  loading: boolean;
  handleChange: (todoId: number, changed: Partial<Todo>) => Promise<void>;
  handleDelete: (todoIds: number) => Promise<void>;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  loading = false,
  handleChange,
  handleDelete,
}) => {
  const [title, setTitle] = React.useState(todo.title);
  const [editStatus, setEditStatus] = React.useState<boolean>(false);
  const inputField = React.useRef<HTMLInputElement>(null);

  const handleTitleChange = React.useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      event.preventDefault();

      if (todo.id) {
        setEditStatus(true);
      }
    },
    [todo.id],
  );

  const handleChangeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title?.trim() === todo.title) {
      setEditStatus(false);

      return;
    }

    if (!title?.trim() && todo.id) {
      handleDelete(todo.id);
    }

    if (title?.trim() && todo.title !== title && todo.id) {
      handleChange(todo.id, { title: title.trim() })
        .then(() => {
          setEditStatus(false);
        })
        .catch(() => {
          inputField.current?.focus();
        });
    }
  };

  const handleChangeCancel = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'Escape') {
      setEditStatus(false);
    }
  };

  React.useEffect(() => {
    if (editStatus) {
      inputField.current?.focus();
    }
  }, [editStatus]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() =>
            handleChange(todo.id as number, { completed: !todo.completed })
          }
          checked={todo.completed}
        />
      </label>

      {editStatus ? (
        <form
          onSubmit={event => handleChangeSubmit(event)}
          onBlur={event => handleChangeSubmit(event)}
          onKeyDown={event => handleChangeCancel(event)}
        >
          <input
            ref={inputField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </form>
      ) : (
        <React.Fragment>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={event => handleTitleChange(event)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id as number)}
          >
            ×
          </button>
        </React.Fragment>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
