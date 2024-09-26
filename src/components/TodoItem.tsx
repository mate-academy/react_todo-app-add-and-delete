import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/TodoContext';
import { Todo } from '../types/Todo';
import { Error } from '../types/ErrorMessage';
import * as TodoService from '../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const {
    updatingIds,
    deleteTodo,
    handleSetErrorMessage,
    handleSetUpdatingIds,
  } = useContext(TodoContext);

  const handleDeleteTodo = (deleteId: number) => {
    handleSetUpdatingIds(deleteId);

    TodoService.deleteTodo(deleteId)
      .then(() => deleteTodo(deleteId))
      .catch(() => handleSetErrorMessage(Error.deleteTodo))
      .finally(() => handleSetUpdatingIds(null));
  };

  return (
    <li
      key={id}
      data-cy="Todo"
      className={classNames('todo', {
        'todo completed': completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': updatingIds.includes(id),
        })}
      >
        <div /* eslint-disable-next-line */
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </li>
  );
};
