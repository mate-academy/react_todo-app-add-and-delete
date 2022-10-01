import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  isActive?: boolean,
  selectedTodosId?: number[],
  newTitle?: string,
  onDelete: (id: number[]) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isActive,
  selectedTodosId,
  newTitle,
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
        {newTitle || title}
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
        selectedTodosId={selectedTodosId}
        id={id}
      />
    </div>
  );
};
