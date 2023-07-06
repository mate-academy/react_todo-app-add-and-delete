import React from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  loadingTodos: number[];
  deleteTodo: (todoId: number) => void;

};

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodos,
  deleteTodo,
}) => {
  const handleRemoveButton = () => {
    deleteTodo(todo.id);
  };

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleRemoveButton}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': loadingTodos.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
