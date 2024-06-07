/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useContext, useState } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { deletePost } from '../api/todos';
import { ErrorContext } from '../contexts/ErrorContext';
import { ActionType } from '../contexts/types/Actions';

export interface TodotodoType {
  todo: Todo;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoItem: React.FC<TodotodoType> = ({ todo, inputRef }) => {
  const { dispatch } = useContext(TodoContext);
  const { error, setError } = useContext(ErrorContext);
  const [deletedId, setDeletedId] = useState(0);

  const { id, title, completed } = todo;

  const deleteTodo = () => {
    setDeletedId(id);
    (inputRef.current as HTMLInputElement).disabled = true;

    return deletePost(id)
      .then(() => dispatch({ type: ActionType.DELETE, payload: id }))
      .catch(reject => {
        if (!error) {
          setError('Unable to delete a todo');
        }

        throw reject;
      })
      .finally(() => {
        setDeletedId(0);
        (inputRef.current as HTMLInputElement).disabled = false;
      })
      .then(() => (inputRef.current as HTMLInputElement).focus());
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          checked={completed}
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo()}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': id === 0 || deletedId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
