/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type TodoItemProps = {
  todo: Todo;
  isTemp?: boolean;
  onDeleteTodo?: (todoId: number) => Promise<void>;
  isDeleting?: boolean;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isTemp,
  onDeleteTodo,
  isDeleting,
}) => {
  const inputId = `todo-status-${todo.id}`;
  const isDisabled = isTemp || isDeleting;
  const isActive = isDisabled;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={inputId}>
        <input
          id={inputId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
          disabled={isDisabled}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title.trim()}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeleteTodo?.(todo.id)}
        disabled={isDisabled}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
