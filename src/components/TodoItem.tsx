import classNames from 'classnames';
import React, { useContext } from 'react';
import { removeTodo } from '../api/todos';
import { TodosContext } from '../stores/TodosContext';
import { ErrorMessages } from '../types/ErrorMessages';

type Props = {
  title: string;
  completed: boolean;
  id?: number;
};

export const TodoItem: React.FC<Props> = ({ title, completed, id = 0 }) => {
  const {
    setTodos,
    setWaitForResponse,
    todoIdToUpdate,
    setTodoIdToUpdate,
    setErrorText,
    setHasErrors,
    idsToDelete,
  } = useContext(TodosContext);

  const handleDelete = () => {
    setWaitForResponse(true);
    setTodoIdToUpdate(id);
    removeTodo(id)
      .then(() => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      })
      .catch(() => {
        setErrorText(ErrorMessages.Delete);
        setHasErrors(true);
      })
      .finally(() => {
        setWaitForResponse(false);
        setTodoIdToUpdate(0);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed === true,
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

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': idsToDelete.includes(id) || todoIdToUpdate === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
