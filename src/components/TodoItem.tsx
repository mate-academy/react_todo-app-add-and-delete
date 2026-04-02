/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  deletingIds: number[];
  toggleTodo: (todo: Todo) => void;
  deleteTodo: (todoId: number, silent?: boolean) => Promise<void>;
  editingTodo: Todo | null;
  newTitle: string;
  setNewTitle: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  handleEditClick: (todo: Todo) => void;
  submitRename: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletingIds,
  toggleTodo,
  deleteTodo,
  editingTodo,
  newTitle,
  setNewTitle,
  handleKeyDown,
  handleEditClick,
  submitRename,
}) => {
  const isEditing = editingTodo?.id === todo.id;
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitRename();
  };

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
          onChange={() => toggleTodo(todo)}
        />
      </label>
      {!isEditing && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleEditClick(todo)}
        >
          {todo.title}
        </span>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            autoFocus
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={submitRename}
          />
        </form>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
