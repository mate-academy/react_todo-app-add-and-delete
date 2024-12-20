/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onRemoveTodo: (todoId: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = props => {
  const { todo, isLoading, onRemoveTodo } = props;
  // const [isCompleted] = useState<boolean>(todo.completed);

  // const handleCompleted = () => {
  //   setIsCompleted(!isCompleted);
  // };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed && 'completed'}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          // onChange={handleCompleted}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onRemoveTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
