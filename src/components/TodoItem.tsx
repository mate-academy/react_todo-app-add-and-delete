import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => void,
  isLoading: boolean,
};

export const TodoItem: React.FC<Props> = ({ todo, removeTodo, isLoading }) => {
  const handleRemoveTodo = (todoId: number) => {
    removeTodo(todoId);
  };

  return (
    <div
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleRemoveTodo(todo.id)}
      >
        ×
      </button>
      <div className={classNames('modal', 'overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
