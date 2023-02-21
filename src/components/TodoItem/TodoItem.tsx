import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodoFromServer: (id: number) => void;
  updateTodoOnServer: (todo: Todo) => void;
  updatingStage: number[];
  handleEditingTodo: (id: number) => void;
  editedTodoId: number;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodoFromServer,
  updateTodoOnServer,
  updatingStage,
  handleEditingTodo,
  editedTodoId,
}) => {
  const [tempTitle, setTempTitle] = useState(todo.title);

  const { title, completed, id } = todo;
  const isBeingEditedNow = editedTodoId === id;

  const handleUpdateStatus = (prevTodo: Todo) => {
    updateTodoOnServer({
      ...prevTodo,
      completed: !completed,
    });
  };

  const handleUpdateTitle = (prevTodo: Todo) => {
    updateTodoOnServer({
      ...prevTodo,
      title: tempTitle,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(event.target.value);
  };

  const saveChanges = () => {
    handleEditingTodo(0);
    handleUpdateTitle(todo);
  };

  const handleBlur = () => {
    saveChanges();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveChanges();
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTempTitle(title);
      handleEditingTodo(0);
    }
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
      {isBeingEditedNow ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={tempTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyUp={handleEscape}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => handleEditingTodo(id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => removeTodoFromServer(id)}
          >
            ×
          </button>
        </>
      )}

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
