import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

interface TodoItemProps {
  todo: Todo;
  onDeleteClick?: () => void;
  loading?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loading,
  onDeleteClick,
}) => {
  const { id, title, completed} = todo;

  return (
    <div
      data-cy="Todo"
      className={
        classNames('todo',
          {
            completed,
          })
      }
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDeleteClick}
      >
        ×
      </button>

      <TodoLoader loading={loading} />
    </div>
  );
};
