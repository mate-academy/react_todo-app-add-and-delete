/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  onDelete?: (todo: Todo) => Promise<unknown> | undefined;
  deleteQueue?: Todo[];
  onError?: (errorMessage: string) => void;
  onToggle?: (todo: Todo) => Promise<unknown> | undefined;
  toggleQueue?: Todo[];
  handleUpdate?: (todo: Todo, newTitle: string) => Promise<boolean> | undefined;
};

export const TodoComponent = ({
  todo,
  isTemp = false,
  onDelete = () => {},
  deleteQueue = [],
  onToggle = () => {},
  toggleQueue = [],
  handleUpdate = () => {},
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(todo.title);

  const handleDelete = () => {
    if (!isTemp) {
      setIsLoading(true);

      onDelete(todo)?.then(() => {
        setIsLoading(false);
      });
    }
  };

  function handleSubmit() {
    const trimmedQuery = query.trim();

    if (trimmedQuery === todo.title) {
      setIsEditing(false);

      return;
    }

    setIsLoading(true);

    if (!trimmedQuery.length) {
      handleDelete();

      return;
    }

    handleUpdate(todo, trimmedQuery)?.then(response => {
      setIsLoading(false);

      if (response) {
        setIsEditing(false);
      }
    });
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            if (!isTemp) {
              setIsLoading(true);

              onToggle(todo)?.then(() => setIsLoading(false));
            }
          }}
        />
      </label>

      {!isEditing && (
        <>
          {' '}
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      {isEditing && (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleSubmit();
          }}
          onBlur={() => handleSubmit()}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setQuery(todo.title);
              setIsEditing(false);
            }
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={event => setQuery(event.target.value)}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active':
            isTemp ||
            isLoading ||
            deleteQueue.includes(todo) ||
            toggleQueue.includes(todo),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
