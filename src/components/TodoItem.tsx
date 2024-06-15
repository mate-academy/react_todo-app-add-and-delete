import React, { useContext, useState, useCallback } from 'react';
import classNames from 'classnames';

import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoErrors } from '../types/TodoErrors';
import { TodoContext } from './TodoContext';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { dispatch } = useContext(TodoContext);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (title.trim()) {
      dispatch({ type: 'EDIT_TODO', id: todo.id, title });
    } else {
      dispatch({ type: 'DELETE_TODO', id: todo.id });
    }

    setIsEditing(false);
  }, [title, todo.id, dispatch]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleBlur();
      } else if (event.key === 'Escape') {
        setTitle(todo.title);
        setIsEditing(false);
      }
    },
    [handleBlur, todo.title],
  );

  const handleToggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_TODO', id: todo.id });
  }, [todo.id, dispatch]);

  const handleDelete = useCallback(async () => {
    dispatch({ type: 'SET_LOADER', id: todo.id });

    try {
      await deleteTodo(todo.id);

      dispatch({ type: 'DELETE_TODO', id: todo.id });
    } catch {
      dispatch({ type: 'SET_ERROR', error: TodoErrors.DELETE_TODO });
      dispatch({ type: 'REMOVE_LOADER', id: todo.id });
    }
  }, [todo.id, dispatch]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
          aria-label="Toggle todo status"
        />
      </label>
      {!isEditing && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}
      {isEditing && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onBlur={handleBlur}
            onChange={event => setTitle(event.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
          disabled={todo.isLoading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': todo.isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
