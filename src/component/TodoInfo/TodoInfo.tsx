import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoInfoProps {
  todo: Todo;
  deleteTodo: (id: number) => void;
}

export const TodoInfo: React.FC<TodoInfoProps> = ({ todo, deleteTodo }) => {
  const { id, title, completed } = todo;

  return (
    <div
      key={id}
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>
      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>
    </div>
  );
};
