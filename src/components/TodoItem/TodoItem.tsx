import React, { useContext } from 'react';

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { IdsContext } from '../../utils/Context/IdsContext';

interface Props {
  todo: Todo
  onDelete: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo, onDelete,
}) => {
  const deletedIds = useContext(IdsContext);

  const isLoading = deletedIds.includes(todo.id);

  return (
    <div
      className={classNames(
        'todo', {
          completed: todo.completed,
        },
      )}
    >
      <label
        className="todo__status-label"
      >
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal overlay', {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
