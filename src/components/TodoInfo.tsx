import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  loading: boolean;
  loadingIds: number[];
  handleDeleteTodo: (todoId: number) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  loading,
  loadingIds,
  handleDeleteTodo,
}) => {
  return (
    <div data-cy="Todo" className={`todo${todo.completed ? ' completed' : ''}`}>
      <label className="todo__status-label" htmlFor="todoStatus">
        <input
          id="todoStatus"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
        {}
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
        disabled={loading}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={`modal overlay${loadingIds.includes(todo.id) ? ' is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
