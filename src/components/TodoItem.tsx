import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { url } from './url';

export const TodoItem: React.FC<{
  todo: Todo;
  askTodos: (url: string, callback?: () => void) => void;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  isFirstLoading?: boolean;
}> = ({
  todo,
  askTodos,
  setErrorMessage,
  isFirstLoading = false,
}) => {
  const { id, completed, title } = todo;
  const [isComplited, setIsComplited] = useState(completed);
  const [isEdit, setIsEdit] = useState(false);
  const [temporaryText, setTemporaryText] = useState(title);
  const [isLoading, setIsLoading] = useState(isFirstLoading);

  useEffect(() => {
    setIsComplited(completed);
  }, [completed]);

  const handleComplited = () => {
    setIsLoading(true);
    setIsComplited(prevState => !prevState);

    client.patch(`/todos/${id}`, { completed: !isComplited })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        askTodos(url, () => setIsLoading(false));
      });
  };

  const handleDelete = () => {
    setIsLoading(true);
    client.delete(`/todos/${id}`)
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        askTodos(url, () => setIsLoading(false));
      });
  };

  const handleEdit = (text: string) => {
    setTemporaryText(text);
    setIsLoading(true);
    client.patch(`/todos/${id}`, { title: text })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        askTodos(url, () => {
          setIsLoading(false);
          setIsEdit(false);
        });
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTemporaryText(event.currentTarget.value);
  };

  const handleSend = () => {
    handleEdit(temporaryText);
  };

  const hendleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    if (event.currentTarget.value !== title) {
      handleEdit(temporaryText);
    }
  };

  const handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      handleSend();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: isComplited },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isComplited}
          onChange={handleComplited}
        />
      </label>

      {isEdit ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={temporaryText}
            onChange={handleChange}
            onBlur={hendleBlur}
            onKeyDown={handleSubmit}
          />
        </form>
      ) : (

        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEdit(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal', 'overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
