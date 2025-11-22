/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo | Omit<Todo, 'id'>;
  isTemp?: boolean;
  handleDelete?: (todoId: number) => Promise<void>;
  isLoading?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isTemp = false,
  handleDelete,
  isLoading: isDeleting = false,
}) => {
  const showLoader = isTemp || isDeleting;
  const todoIdForPermanent = (todo as Todo).id;

  return (
    <div
      data-cy="Todo"
      key={isTemp ? 'temp-todo' : todoIdForPermanent}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label
        className="todo__status-label"
        htmlFor={isTemp ? 'temp-status' : `todo-status-${todoIdForPermanent}`}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          id={isTemp ? 'temp-status' : `todo-status-${todoIdForPermanent}`}
          disabled={isDeleting}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          if (handleDelete && !isTemp) {
            handleDelete(todoIdForPermanent);
          }
        }}
        disabled={showLoader}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': showLoader,
        })}
      >
        <div
          className={classNames('modal-background', 'has-background-white-ter')}
        />
        <div className="loader" />
      </div>
    </div>
  );
};
