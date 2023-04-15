import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDeleteTodo: (id: number) => void,
  loadingTodos: number[],
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  loadingTodos,
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  const isLoading = loadingTodos.includes(id);

  return (
    <div className={classNames(
      'todo',
      {
        completed,
      },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>
      <span className="todo__title">{ title }</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          onDeleteTodo(id);
        }}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        {
          'is-active': isLoading,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
