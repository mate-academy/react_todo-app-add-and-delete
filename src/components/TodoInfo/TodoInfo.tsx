import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoadingTodo: number[],
  onRemoveTodo: (todoId: number) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoadingTodo,
  onRemoveTodo,
}) => {
  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onRemoveTodo(todo.id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoadingTodo.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
