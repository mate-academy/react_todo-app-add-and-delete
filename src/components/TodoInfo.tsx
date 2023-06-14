import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deletedTodosId: number[] | [];
  handleDeletedTodo: (id: number) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  deletedTodosId,
  handleDeletedTodo,
}) => {
  const { title, completed, id } = todo;
  const isDeleted = deletedTodosId.some(todoId => todoId === id);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeletedTodo(id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        {
          'is-active': isDeleted,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
