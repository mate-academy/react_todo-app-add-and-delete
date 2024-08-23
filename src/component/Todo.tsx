/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { Loading } from './Loading';

type Props = {
  todo: Todo | null;
  handleDelete: (id: number) => void;
  isProcessing: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDelete,
  isProcessing,
}) => {
  if (!todo) {
    return null; // Повертає `null`, якщо `todo` не існує.
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      {isProcessing && <Loading />}
    </div>
  );
};
