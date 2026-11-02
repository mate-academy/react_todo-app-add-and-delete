import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  deletingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  deletingIds,
}) => (
  <div
    data-cy="Todo"
    className={`todo ${todo.completed === true ? 'completed' : ''}`}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        aria-label="Toggle todo status"
      />
    </label>

    {false ? (
      <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form>
    ) : (
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
    )}

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => {
        deleteTodo(todo.id);
      }}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': deletingIds.includes(todo.id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
