import classNames from 'classnames';

import { useState } from 'react';
import { Action, Todo } from '../types';
import { deleteTodo } from '../api';
import { useError, useTodos } from '../providers';
import { ERRORS } from '../utils';

type Props = {
  todo: Todo;
  loading?: boolean;
};

export const TodoItem:React.FC<Props> = ({ todo, loading = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useTodos();
  const { setError } = useError();

  const handleDeleteClick = () => {
    setIsLoading(true);

    deleteTodo(todo.id)
      .then(() => {
        dispatch({
          type: Action.Remove,
          payload: todo.id,
        });
      })
      .catch(() => {
        setError(ERRORS.DELETE_TODO);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      {true ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            data-cy="TodoDelete"
            className="todo__remove"
            onClick={handleDeleteClick}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
