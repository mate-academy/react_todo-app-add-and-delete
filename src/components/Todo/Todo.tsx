import React from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../../types/Todo';

type Props = {
  todo: TodoType;
  handleDeleteTodo: (id: number) => void;
  deleteId: number[];
};

export const Todo: React.FC<Props> = ({ todo, handleDeleteTodo, deleteId }) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed === true })}
    >
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': deleteId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
