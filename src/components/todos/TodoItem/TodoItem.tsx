import classNames from 'classnames';
import React, { useState } from 'react';

interface Props {
  id: number,
  title: string,
  completed: boolean,
  removeTodo: (id: number) => void;
  isLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  removeTodo,
  isLoading,
}) => {
  const [removedId, setRemovedId] = useState(0);

  const remove = async (todoId: number) => {
    setRemovedId(id);
    await removeTodo(todoId);
  };

  return (
    <div
      key={id}
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

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => remove(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': removedId === id || isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
