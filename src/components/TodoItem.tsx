import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onTodoCompleteChange: (todoId: number, completed: boolean) => void;
  onTodoRemove: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodoCompleteChange,
  onTodoRemove,
  isLoading,
}) => {
  return (
    <div data-cy="Todo" className={cn('todo', todo.completed && 'completed')}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          onClick={() => onTodoCompleteChange(todo.id, !todo.completed)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onTodoRemove(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
