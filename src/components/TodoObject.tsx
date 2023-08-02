/* eslint-disable no-console */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../context/todoContext';

type Props = {
  todo: Todo;
};

export const TodoObject: React.FC<Props> = ({ todo }) => {
  const { handleCheck, handleDeleteTodo, loading } = useContext(TodoContext);

  return (
    <>
      <div
        key={todo.id}
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => handleCheck(todo.id)}
          />
        </label>

        <span className="todo__title">{todo.title}</span>

        <button
          type="button"
          className="todo__remove"
          onClick={() => handleDeleteTodo(todo.id)}
        >
          ×
        </button>

        {loading.includes(todo.id) && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </>
  );
};
