import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodoFromServer: (id: number) => void;
  updateTodoOnServer: (todo: Todo) => void;
  updatingStage: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodoFromServer,
  updateTodoOnServer,
  updatingStage,
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

      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodoFromServer(id)}
      >
        ×
      </button>
      {/* This form is shown instead of the title and remove button */}
      {/* <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form> */}

      {/* overlay will cover the todo while it is being updated */}

      <div
        className={classNames('modal overlay', {
          'is-active': updatingStage.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
