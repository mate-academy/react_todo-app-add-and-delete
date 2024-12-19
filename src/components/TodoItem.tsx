/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  deletedTodo?: number | null;
  isDeleteCompleted?: boolean;
  isTempoTodo: boolean;
  onDelete: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = props => {
  const { todo, deletedTodo, isDeleteCompleted, isTempoTodo, onDelete } = props;

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
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

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active':
              isTempoTodo ||
              (isDeleteCompleted && todo.completed) ||
              todo.id === deletedTodo,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
