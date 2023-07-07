import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import './TodoInfo.scss';

interface TodoInfoProps {
  todo: Todo;
  onRemoveTodo: (id: number) => void;
  loadingtodoIds: number[];
}

export const TodoInfo: React.FC<TodoInfoProps> = ({
  todo,
  onRemoveTodo,
  loadingtodoIds,
}) => {
  const { id, title, completed } = todo;

  const handleRemoveClick = () => {
    onRemoveTodo(id);
  };

  return (
    <div
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleRemoveClick}
      >
        ×
      </button>

      <div
        className={cn(
          'modal',
          'overlay',
          { 'is-active': loadingtodoIds.includes(id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
