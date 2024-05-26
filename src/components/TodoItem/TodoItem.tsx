/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';

import './TodoItem.scss';
import { Props } from './Props';
import { useTodos } from '../../TodosProvider/useTodos';
import { Todo } from '../../types/Todo';
import { ActionType } from '../../types/ActionType';

// eslint-disable-next-line react/display-name
export const TodoItem: React.FC<Props> = ({ todo, onDelete, isLoading }) => {
  const { setTodos } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleSubmit = (editableTodo: Todo) => {
    const trimmedTitle = newTitle.trim();

    setNewTitle(trimmedTitle);
    setIsEditing(false);
    setTodos({
      type: ActionType.ChangeName,
      payload: { id: editableTodo.id, title: trimmedTitle },
    });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(todo.title);
    }
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
          onChange={() =>
            setTodos({ type: ActionType.ChangeStatus, payload: todo.id })
          }
        />
      </label>

      {!isEditing ? (
        <>
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
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', {
              'is-active': isLoading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      ) : (
        <>
          <form
            onSubmit={() => handleSubmit(todo)}
            onBlur={() => handleSubmit(todo)}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onKeyUp={handleKeyUp}
              autoFocus
            />
          </form>

          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', {
              'is-active': isLoading,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
