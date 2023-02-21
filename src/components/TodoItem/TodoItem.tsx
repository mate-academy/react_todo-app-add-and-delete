import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  fetchDeleteTodo: (todoId: number) => void,
  isLoading: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  fetchDeleteTodo,
  isLoading,
}) => {
  const { title, completed, id } = todo;

  return (
    <>
      <div className={classNames(
        'todo', {
          completed,
        },
      )}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            defaultChecked={completed}
          />
        </label>

        <span className="todo__title">{title}</span>

        <button
          type="button"
          className="todo__remove"
          onClick={() => {
            fetchDeleteTodo(id);
          }}
        >
          ×
        </button>

        <div className={classNames(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is being edited */}
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        {/* This form is shown instead of the title and remove button */}
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
