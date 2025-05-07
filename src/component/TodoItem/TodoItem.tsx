/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  loader: number[];
  inEdition: number | null;
  editingTitle: string;
  onChangeHandler: (id: number) => void;
  setInEdition: (id: number | null) => void;
  setEditingTitle: (title: string) => void;
  getEditionKeyDownHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  getEditionTitleHandler: (id: number) => void;
  getDeleteHandler: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loader,
  inEdition,
  editingTitle,
  onChangeHandler,
  setInEdition,
  setEditingTitle,
  getEditionKeyDownHandler,
  getEditionTitleHandler,
  getDeleteHandler,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onChangeHandler(todo.id)}
        />
      </label>

      {inEdition !== todo.id ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setInEdition(todo.id);
            setEditingTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      ) : (
        <form onSubmit={e => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value)}
            onKeyDown={getEditionKeyDownHandler}
            onBlur={() => getEditionTitleHandler(todo.id)}
            autoFocus
          />
        </form>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => getDeleteHandler(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loader.includes(todo.id) ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
