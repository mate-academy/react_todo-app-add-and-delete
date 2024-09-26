import React, { useCallback } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

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
  const onDeleteClick = useCallback(() => {
    handleDeleteTodo(id);
  }, [id, handleDeleteTodo]);

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed })}>
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
          onClick={onDeleteClick}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', { 'is-active': addTodoId === id })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
