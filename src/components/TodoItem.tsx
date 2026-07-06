/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  isTemp: boolean;
  editingTitle: string;
  editTodoField: React.RefObject<HTMLInputElement>;
  onToggle: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  onStartEditing: (todo: Todo) => void;
  onRename: (todo: Todo) => void;
  onEditingTitleChange: (title: string) => void;
  onCancelEditing: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  isEditing,
  isTemp,
  editingTitle,
  editTodoField,
  onToggle,
  onDelete,
  onStartEditing,
  onRename,
  onEditingTitleChange,
  onCancelEditing,
}) => (
  <div
    data-cy="Todo"
    className={`todo ${todo.completed ? 'completed' : ''}`}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        disabled={isLoading || isTemp}
        onChange={() => !isTemp && onToggle(todo)}
      />
    </label>

    {isEditing && !isTemp ? (
      <form
        onSubmit={event => {
          event.preventDefault();
          onRename(todo);
        }}
      >
        <input
          ref={editTodoField}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editingTitle}
          onChange={event => onEditingTitleChange(event.target.value)}
          onBlur={() => onRename(todo)}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              onCancelEditing();
            }
          }}
        />
      </form>
    ) : (
      <>
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => !isTemp && onStartEditing(todo)}
        >
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isLoading || isTemp}
          onClick={() => !isTemp && onDelete(todo.id)}
        >
          ×
        </button>
      </>
    )}

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isLoading ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
