import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodoFromServer: (id: number) => void;
  updateTodoOnServer: (todo: Todo) => void;
  updatingStage: number[];
  handleTodoEditor: (id: number) => void;
  editedTodoId: number;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  removeTodoFromServer,
  updateTodoOnServer,
  updatingStage,
  handleTodoEditor,
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
    handleTodoEditor(0);
    handleUpdateTitle(todo);
  };

  const rejectChanges = () => {
    handleTodoEditor(0);
  };

  const handleBlur = () => {
    switch (tempTitle.trim()) {
      case title:
        rejectChanges();
        break;

      case '':
        removeTodoFromServer(id);
        break;

      default:
        saveChanges();
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (tempTitle.trim() === '') {
      removeTodoFromServer(id);

      return;
    }

    saveChanges();
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTempTitle(title);
      rejectChanges();
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
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => handleTodoEditor(id)}
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
});
