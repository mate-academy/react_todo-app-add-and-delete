import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodo } from '../TodoContext/TodoContext';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    toggleTodo,
    deleteTodo,
    updateTodo,
  } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    setIsLoading(true);

    setTimeout(() => {
      toggleTodo(todo.id);
      setIsLoading(false);
    }, 500);
  };

  const handleDeleteTodo = () => {
    setIsLoading(true);

    setTimeout(() => {
      deleteTodo(todo.id);
      setIsLoading(false);
    }, 500);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setUpdatedTitle(todo.title);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(event.target.value);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTodoUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsEditing(false);

    setTimeout(() => {
      if (!updatedTitle.trim()) {
        deleteTodo(todo.id);
      } else {
        updateTodo(updatedTitle, todo.id);
      }

      setIsLoading(false);
    }, 500);
  };

  const handleBlur = () => {
    setIsLoading(true);
    setIsEditing(false);

    setTimeout(() => {
      if (!updatedTitle.trim()) {
        deleteTodo(todo.id);
      } else {
        updateTodo(updatedTitle, todo.id);
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          title="chekbox"
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleTodoUpdate}
          onBlur={handleBlur}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={handleTitleChange}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteTodo}
          >
            ×
          </button>
        </>

      )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
