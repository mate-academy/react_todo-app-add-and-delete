/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { DispatchContext, StateContext } from '../states/Global';
import { ActionType } from '../states/Reducer';
import { ErrorType } from '../types/ErrorType';

interface Props {
  todo: Todo
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id: todoId, title, completed } = todo;
  const { userId } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const editInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsEditing(false);
  };

  const handleDelete = () => {
    setIsLoading(true);

    deleteTodo(userId, todoId)
      .then(() => {
        dispatch({
          type: ActionType.DeleteTodo,
          payload: { id: todoId },
        });
      })
      .catch(() => {
        dispatch({
          type: ActionType.ToggleError,
          payload: { errorType: ErrorType.DeleteError },
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setNewTitle(title);
      }
    };

    document.addEventListener('keyup', handleEscape);

    return () => {
      document.removeEventListener('keyup', handleEscape);
    };
  }, [title]);

  useEffect(() => {
    if (editInput.current) {
      editInput.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
        />
      </label>

      {!isEditing
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              { title }
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDelete}
            >
              ×
            </button>
          </>
        )
        : (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={editInput}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={() => setIsEditing(false)}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
