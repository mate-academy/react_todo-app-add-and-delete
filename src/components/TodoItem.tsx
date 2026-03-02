/* eslint-disable jsx-a11y/label-has-associated-control */
// components/TodoItem.tsx
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  isUpdating: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isUpdating,
  onToggle,
  onDelete,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
          data-cy="TodoStatus"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDelete}
        disabled={isUpdating}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {isUpdating && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

export default TodoItem;
