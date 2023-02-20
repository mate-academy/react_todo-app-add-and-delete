import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodoFromServer: (id: number) => void;
  updateTodoOnServer: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodoFromServer,
  updateTodoOnServer,
}) => {
  const { title, completed, id } = todo;

  const handleUpdateStatus = (prevTodo: Todo) => {
    updateTodoOnServer({
      ...prevTodo,
      completed: !completed,
    });
  };

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdateStatus(todo)}
        />
      </label>

      <span className="todo__title">{title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodoFromServer(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
