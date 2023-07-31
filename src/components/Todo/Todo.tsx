import React, { useState } from 'react';
import cn from 'classnames';

import './Todo.scss';
import { TodoType } from '../../types/TodoType';

type Props = {
  todo: TodoType;
  onDelete: (todoId: number) => Promise<void>;
  ids: number[];
};

export const Todo: React.FC<Props> = ({ todo, onDelete, ids }) => {
  const [completed, setCompleted] = useState(todo.completed);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompleted = () => setCompleted(!completed);

  const deleteTodo = () => {
    setIsLoading(true);

    onDelete(todo.id)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={handleCompleted}
        />
      </label>

      <span
        className="todo__title"
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={deleteTodo}
        disabled={isLoading || ids.includes(todo.id)}
      >
        ×
      </button>

      <div
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isLoading || ids.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
