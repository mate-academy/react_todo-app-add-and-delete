import React from 'react';
import classNames from 'classnames';
import { Todo as TodoType } from '../types/Todo';

interface TodoProps {
  todo: TodoType;
  onDelete?: () => void;
  isProcessed?: boolean;
}

export const Todo: React.FC<TodoProps> = ({
  todo,
  onDelete,
  isProcessed = false,
}) => {
  const inputId = `todo-${todo.id}`;
  const isTempTodo = todo.id === 0;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <input
        id={inputId}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        aria-labelledby={`todo-title-${todo.id}`}
        readOnly
        disabled={isTempTodo}
      />

      <span
        id={`todo-title-${todo.id}`}
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>

      {onDelete && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete}
          disabled={isProcessed}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
