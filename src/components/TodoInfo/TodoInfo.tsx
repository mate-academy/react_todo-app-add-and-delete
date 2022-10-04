import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  title: string,
  completed: boolean;
  onDelete: (todo: number) => void
  todo: Todo
  isAdding?: boolean
};

export const TodoInfo: React.FC<Props> = ({
  title,
  completed,
  onDelete,
  todo,
  isAdding,
}) => {
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleCheck = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { 'todo completed': isCompleted })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheck}
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          { 'modal overlay is-active': isAdding })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
