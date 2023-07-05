import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  removeTodo: (id: number) => void;
  loadingTodo: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  loadingTodo,
}) => {
  const { id, title, completed } = todo;

  return (
    <div className={cn('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      <div className={cn('modal overlay',
        { 'is-active': loadingTodo.includes(id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
