/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onEdit: (updatedTodo: Todo) => void;
  onRemove: (idToRemove: number) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(
  ({ todo, onEdit, onRemove, isLoading }) => {
    const [isEdited, setIsEdited] = useState(false);
    const [todoTitle, setTodoTitle] = useState(todo.title);

    const resetEditForm = () => {
      setTodoTitle('');
      setIsEdited(false);
    };

    const handleTodoComplete = () => {
      const newTodo = {
        ...todo,
        completed: !todo.completed,
      };

      onEdit(newTodo);
    };

    const handleTodoEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const titleToSubmit = todoTitle.trim();

      if (!titleToSubmit) {
        onRemove(todo.id);

        return;
      }

      const newTodo = {
        ...todo,
        title: titleToSubmit,
      };

      onEdit(newTodo);
      resetEditForm();
    };

    const handleTodoEditChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setTodoTitle(event.target.value);
    };

    const handleTodoRemove = () => {
      onRemove(todo.id);
    };

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
            onChange={handleTodoComplete}
          />
        </label>

        {isEdited ? (
          <form onSubmit={handleTodoEditSubmit} onReset={resetEditForm}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoEditChange}
              onBlur={() => setIsEdited(false)}
              autoFocus
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEdited(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleTodoRemove}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
