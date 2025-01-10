import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type TodoItemProps = {
  todo: Todo;
  handleDelete?: (id: number) => void;
  isLoading?: boolean;
  isTemp?: boolean;
  todoToBeDeleted?: number[];
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleDelete,
  isTemp,
  todoToBeDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const { id, completed, title } = todo;
  const handleTriggerEdit = () => {
    setIsEditing(prevState => !prevState);
  };

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const loaderClass = classNames('modal overlay', {
    'is-active': isTemp || todoToBeDeleted?.includes(id),
  });

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`todoStatus-${id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`todoStatus-${id}`}
          checked={completed}
        />
      </label>

      <div data-cy="TodoLoader" className={loaderClass}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} id={`todoStatus-${id}`}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={handleEdit}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTriggerEdit}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete && handleDelete(id)}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};
