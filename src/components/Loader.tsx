/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import '../styles/Loader.scss';
import classNames from 'classnames';
import { TodosContext } from './Todos-Context';
import { USER_ID } from '../api/todos';

export const Loader: React.FC = () => {
  // eslint-disable-next-line max-len, prettier/prettier
  const { tempTodo, todoDeleteButton, handleCompleted } = useContext(TodosContext);

  return (
    <div>
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed: tempTodo?.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={tempTodo?.completed}
            onChange={() => handleCompleted(tempTodo?.id ?? -1)}
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo?.title.trim()}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            todoDeleteButton(USER_ID, tempTodo?.id ?? -1);
          }}
        >
          ×
        </button>
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': tempTodo })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </div>
  );
};
