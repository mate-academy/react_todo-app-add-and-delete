import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  onDelete?: () => Promise<void>;
  onRename?: (title: string) => Promise<void>;
  onToggleTodo?: () => Promise<void>;
  onCreateTodo?: (newTodo: string) => Promise<void>;
  onLoading: boolean;
};
export const TodoRow: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onRename = () => {},
  onToggleTodo = () => {},
  onLoading,
}) => {
  const [edited, setEdited] = useState(false);
  const [title, setTitle] = useState(todo.title);

  // #region handlers
  const handleRemoveClick = () => {
    setEdited(false);
    onDelete();
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title) {
      onRename(title);
    } else {
      onDelete();
    }

    setEdited(false);
  };

  const handleTodoStatusEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setEdited(false);
    onToggleTodo();
  };

  // #endregion

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleTodoStatusEdit}
          />
        </label>

        {edited ? (
          <form onSubmit={handleEditSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onChange={event => setTitle(event.target.value)}
              onBlur={() => setEdited(false)}
              autoFocus
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setEdited(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleRemoveClick}
              disabled={onLoading}
            >
              ×
            </button>
          </>
        )}
        <Loader loading={onLoading} />
      </div>
    </>
  );
};
