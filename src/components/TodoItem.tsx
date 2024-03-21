// eslint-disable jsx-a11y/label-has-associated-control
import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './Todos-Context';
import { USER_ID } from '../api/todos';

interface PropsItem {
  todo: Todo;
}
export const TodoItem: React.FC<PropsItem> = ({ todo }) => {
  // eslint-disable-next-line max-len, prettier/prettier
  const { loading, handleCompleted, todoDeleteButton, deletingTodos } = useContext(TodosContext);
  const { title, completed, id } = todo;

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
          onChange={() => handleCompleted(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => todoDeleteButton(USER_ID, id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletingTodos.includes(id),
        })}
      >
        <div
          className={classNames('modal-background has-background-white-ter', {
            'is-active': loading,
          })}
        />
        <div className="loader" />
      </div>
    </div>
  );
};
