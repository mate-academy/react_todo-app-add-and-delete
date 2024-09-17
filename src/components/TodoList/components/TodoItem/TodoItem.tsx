/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import './todo.scss';
import { useContext } from 'react';
import { todosContext } from '../../../../Store';
import { TodoWithLoader } from '../../../../types/TodoWithLoader';
import { handleDelete } from '../../../../utils/handleDelete';
type Props = { todo: TodoWithLoader };

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, setUpdatedAt, setErrorMessage } = useContext(todosContext);

  function onDelete() {
    setErrorMessage('');
    handleDelete(todo, setTodos, setErrorMessage, setUpdatedAt);
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      {/* This form is shown instead of the title and remove button */}
      {false && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field hidden"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
