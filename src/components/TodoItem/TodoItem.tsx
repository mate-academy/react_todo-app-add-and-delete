import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  isActive?: boolean,
  selectedTodosIds?: number[],
  onDelete: (id: number[]) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isActive,
  selectedTodosIds,
  onDelete,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete([id])}
      >
        &times;
      </button>

      <Loader
        isActive={isActive}
        selectedTodosId={selectedTodosIds}
        id={id}
      />
    </div>
  );
};
