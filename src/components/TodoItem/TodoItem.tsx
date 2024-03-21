import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => void;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, removeTodo, isLoading }) => {
  const handleRemoving = () => {
    removeTodo(todo.id);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames({
        todo: true,
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
        onClick={handleRemoving}
      >
        ×
      </button>
      <TodoLoader isActive={isLoading} />
    </div>
  );
};
