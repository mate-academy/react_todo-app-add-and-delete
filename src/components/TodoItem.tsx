import classNames from 'classnames';
import React, { useCallback } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  addTodoId: number | null;
  handleDeleteTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed, id },
  addTodoId,
  handleDeleteTodo,
}) => {
  const onDelete = useCallback(() => {
    handleDeleteTodo(id);
  }, [id, handleDeleteTodo]);

  return (
    <>
      <div data-cy="Todo" className={classNames('todo', { completed })}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
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
          onClick={onDelete}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': addTodoId === id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
