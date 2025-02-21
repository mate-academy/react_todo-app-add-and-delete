/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  handleComplete: (id: number) => void;
  handleDelete: (id: number) => Promise<unknown>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleComplete,
  handleDelete,
}) => {
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(todo.id === 0);
  const { id, title, completed } = todo;

  const deleteTodo = async (idForDeleting: number) => {
    try {
      setIsLoading(true);
      await handleDelete(idForDeleting);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleComplete(id)}
          checked={completed}
        />
      </label>

      {/* This form is shown instead of the title and remove button */}

      {edit ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
