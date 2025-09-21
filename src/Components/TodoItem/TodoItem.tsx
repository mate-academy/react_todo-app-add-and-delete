/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
// import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onUpdateTodo: (updatedTodo: Todo) => Promise<void>;
  onDeleteTodo: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editing, setEditing] = useState(false);

  const todoTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoTitleRef.current) {
      todoTitleRef.current.focus();
    }
  }, [editing]);

  async function handleUpdateTodo() {
    setEditing(false);
    const trimmedEditTitle = editTitle.trim();

    try {
      if (trimmedEditTitle === '') {
        onDeleteTodo(todo.id);

        return;
      }

      if (editTitle !== todo.title) {
        await onUpdateTodo({ ...todo, title: trimmedEditTitle });
        setEditing(false);
      }
    } catch (error) {
      setEditing(true);
    }
  }

  function handleChangeCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    onUpdateTodo({ ...todo, completed: e.target.checked });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleUpdateTodo();
  }

  function handleCancel(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setEditing(false);
    }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo item-enter item-enter-active', {
        completed: todo.completed,
      })}
      onDoubleClick={() => setEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeCheckbox}
          disabled={isLoading}
        />
      </label>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitle"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will bee deleted"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={handleUpdateTodo}
            onKeyDown={handleCancel}
            autoFocus
            ref={todoTitleRef}
            disabled={isLoading}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {editTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
