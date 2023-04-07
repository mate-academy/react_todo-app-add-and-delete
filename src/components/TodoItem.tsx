import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const TodoItem = React.memo(
  ({
    todo,
    askTodos,
    setErrorMessage,
  }: {
    todo: Todo,
    askTodos: (url: string) => void
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  }) => {
    const { id, completed, title } = todo;
    const [isComplited, setIsComplited] = useState(completed);
    const [isEdit, setIsEdit] = useState(false);
    const [temporaryText, setTemporaryText] = useState(title);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsComplited(completed);
    }, [completed]);

    const handleComplited = () => {
      setIsLoading(prevState => !prevState);
      setIsComplited(prevState => !prevState);

      client.patch(`/todos/${id}`, { completed: !isComplited })
        .catch(() => setErrorMessage('Unable to update a todo'))
        .finally(() => {
          setIsLoading(prevState => !prevState);
          askTodos('/todos?userId=6757');
        });
    };

    const handleDelete = () => {
      setIsLoading(prevState => !prevState);
      client.delete(`/todos/${id}`)
        .catch(() => setErrorMessage('Unable to delete a todo'))
        .finally(() => {
          setIsLoading(prevState => !prevState);
          askTodos('/todos?userId=6757');
        });
    };

    const handleEdit = (text: string) => {
      setIsLoading(prevState => !prevState);
      client.patch(`/todos/${id}`, { title: text })
        .catch(() => setErrorMessage('Unable to update a todo'))
        .finally(() => {
          setIsLoading(prevState => !prevState);
          askTodos('/todos?userId=6757');
        });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTemporaryText(event.currentTarget.value);
    };

    const handleSend = () => {
      handleEdit(temporaryText);
      setIsEdit(false);
    };

    const handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();

        handleSend();
      }
    };

    return (
      <>
        <div className={classNames(
          'todo', { completed: isComplited },
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
                onBlur={handleSend}
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

          <div className={classNames(
            'modal', 'overlay',
            { 'is-active': isLoading },
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      </>
    );
  },
);
