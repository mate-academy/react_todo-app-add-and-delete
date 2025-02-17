import React, { useContext, useEffect, useState } from 'react';

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../services/TodoContext';

type Props = {
  todo: Todo;
  isLoading?: boolean;
};

export const TodoInfo: React.FC<Props> = ({ todo, isLoading = false }) => {
  const { updateTodo, deleteTodo } = useContext(TodoContext);
  const [beingEdited, setBeingEdited] = useState(false);
  const [loading, setLoading] = useState(isLoading);
  const [title, setTitle] = useState(todo.title);

  const updateTodoTitle = () => {
    setLoading(true);
    setBeingEdited(false);

    if (title.trim() === '') {
      deleteTodo(todo.id);

      return;
    }

    updateTodo({ ...todo, title: title }).finally(() => {
      setLoading(false);
      setBeingEdited(false);
    });
  };

  const handleDoubleClick = () => {
    setBeingEdited(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateTodoTitle();
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleChangeCompleted = () => {
    updateTodo({ ...todo, completed: !todo.completed });
  };

  const handleDelete = () => {
    setLoading(true);

    deleteTodo(todo.id).finally(() => {
      setLoading(false);
    });
  };

  const handleKeyup = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setBeingEdited(false);
      setTitle(todo.title);
    } else if (event.key === 'Enter') {
      updateTodoTitle();
    }
  };

  useEffect(() => {
    if (beingEdited) {
      document.addEventListener('keyup', handleKeyup);

      return () => {
        document.removeEventListener('keyup', handleKeyup);
      };
    }

    return;
  });

  return (
    <>
      {/* This is a completed todo */}
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleChangeCompleted}
          />
        </label>

        {!beingEdited ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDelete}
            >
              ×
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              autoFocus
              value={title}
              onChange={handleTitleChange}
              onBlur={updateTodoTitle}
            />
          </form>
        )}

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': loading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
