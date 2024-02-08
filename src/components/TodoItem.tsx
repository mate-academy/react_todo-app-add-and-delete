import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  loading?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  loading = false,
}) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        ' todo ',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={isCompleted}
          onChange={(e) => setIsCompleted(e.currentTarget.checked)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
        onChange={() => { }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
