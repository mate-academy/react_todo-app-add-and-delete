import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  handleDeleteTodo: (id: number) => () => void,
  isActiveId: number | null,
  setIsActiveId: (id: number | null) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  handleDeleteTodo,
  isActiveId,
  setIsActiveId,
}) => {
  const { title, completed, id } = todo;

  const handleDeleteItem = (todoId: number) => () => {
    handleDeleteTodo(todoId)();

    setIsActiveId(todoId);
  };

  return (
    <div className={classNames('todo', {
      completed,
    })}
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
        onClick={handleDeleteItem(id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isLoading && (id === isActiveId || id === 0),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
