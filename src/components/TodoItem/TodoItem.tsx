import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  isDeleteWaiting: boolean;
  changeRemoveTodoIds: (id: number[]) => void;
  onRemoveTodoIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  isDeleteWaiting,
  changeRemoveTodoIds,
  onRemoveTodoIds,
}) => {
  const { title, completed, id } = todo;

  const handleDeleteButtonClick = (todoId: number) => {
    changeRemoveTodoIds([id]);

    deleteTodo(todoId);
  };

  return (
    <div className={classNames(
      'todo',
      {
        completed,
      },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {/* <form>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form> */}

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteButtonClick(id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        {
          'is-active': isDeleteWaiting && onRemoveTodoIds.includes(id),
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
