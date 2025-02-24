import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  handleDeleteTodo: (id: number) => void;
  isDeleting: boolean;
  loading?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleDeleteTodo,
  isDeleting,
  loading,
}) => {
  const { completed, title } = todo;

  return (
    <div>
      <div
        key={todo.id}
        data-cy="Todo"
        className={`todo ${todo.completed ? 'completed' : ''}`}
      >
        <label className="todo__status-label" aria-label="status">
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
          onClick={() => handleDeleteTodo(todo.id)}
          disabled={isDeleting}
        >
          {isDeleting ? '' : '×'}
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': loading || isDeleting,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </div>
  );
};
