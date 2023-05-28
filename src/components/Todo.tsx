import React from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../types/Todo';

interface TodoProps {
  todo: TodoType,
  handleRemoveTodo: (id: string) => void;
}

export const Todo: React.FC<TodoProps> = React.memo(({
  todo,
  handleRemoveTodo,
}) => {
  const { completed, id, title } = todo;

  return (
    <div
      className={cn('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleRemoveTodo(id.toString())}
      >
        ×

      </button>

    </div>
  );
});
