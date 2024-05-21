/* eslint-disable */
import React, { useState } from 'react';
import { Button } from './Button';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (
    setIsDeleting: React.Dispatch<React.SetStateAction<number>>,
    todoItem: Todo,
  ) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState<number>(0);
  return (
    <>
      <div
        data-cy="Todo"
        className={todo.completed ? 'todo completed' : 'todo'}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <Button
          type="button"
          className="todo__remove"
          dataCy="TodoDelete"
          onClick={() => onDelete(setIsDeleting, todo)}
        >
          ×
        </Button>

        <div
          data-cy="TodoLoader"
          className={`modal overlay ${isLoading || isDeleting === todo.id ? 'is-active' : ''}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};

