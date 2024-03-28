/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: {
    title: string;
    userId: number;
    id: number;
    completed: boolean;
  };
  isLoading?: boolean;
  onDelete: (id: number) => void;
  onUpdate: (updatedTodo: Todo) => void;
  toggleTodoCompletion: (todoId: number) => void;
};
export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
  toggleTodoCompletion,
}) => {
  const { title, userId, id, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      onSubmit={() => onUpdate(todo)}
    >
      {completed}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          placeholder="Empty todo will be deleted"
          onChange={() => toggleTodoCompletion(id)}
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          onDelete(id);
        }}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': userId === id || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
