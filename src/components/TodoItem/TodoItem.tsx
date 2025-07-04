import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  toggleTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  loading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodo,
  deleteTodo,
  loading,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      key={id}
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
    >
      <label htmlFor={`${id}`} className="todo__status-label">
        {}
        <input
          id={`${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
