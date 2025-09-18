/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  onDeleteTodos: (id: number) => Promise<void>;
  onUpdatePost: (todo: Todo) => Promise<void>;
  loading: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onUpdatePost,
  onDeleteTodos,
  loading,
}) => {
  const [query, setQuery] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { id, title, completed } = todo;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setShowInput(true);
    setQuery(title);
  };

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery === title) {
      setShowInput(false);

      return;
    }

    if (trimmedQuery === '') {
      onDeleteTodos(id).then(() => setShowInput(false));

      return;
    }

    onUpdatePost({ ...todo, title: query.trim() }).then(() =>
      setShowInput(false),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowInput(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            onUpdatePost({ ...todo, completed: !completed });
          }}
        />
      </label>

      {showInput ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onBlur={handleSubmit}
            onChange={e => setQuery(e.target.value)}
            ref={inputRef}
            onKeyUp={handleKeyDown}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
          <button
            type="button"
            data-cy="ForceEdit"
            onClick={handleDoubleClick}
            style={{ display: 'none' }}
          />
        </span>
      )}

      {!showInput && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDeleteTodos(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading.includes(id || 0),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
