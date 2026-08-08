import React from 'react';
import classNames from 'classnames';
import { Todo } from './types';

type TodoItemProps = {
  todo: Todo;
  isProcessed: boolean;
  onDelete?: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, isProcessed, onDelete }) => {
  const checkboxId = `todo-${todo.id}`;

  return (
    <div className={classNames('todo', { completed: todo.completed })} data-cy="Todo">
      <label
        className="todo__status-label"
        htmlFor={checkboxId}
        aria-label="Toggle todo completion"
      >
        <input
          id={checkboxId}
          className="todo__status"
          type="checkbox"
          data-cy="TodoStatus"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span className="todo__title" data-cy="TodoTitle">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        aria-label="Delete todo"
        data-cy="TodoDelete"
        onClick={onDelete}
      >
        ×
      </button>

      <span
        className={classNames('loader', { 'is-active': isProcessed })}
        data-cy="TodoLoader"
      />
    </div>
  );
};
