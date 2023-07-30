import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../context/todoContext';

type Props = {
  todo: Todo;
};

export const TodoObject: React.FC<Props> = ({ todo }) => {
  const { handleCheck, handleDelete } = useContext(TodoContext);

  return (
    <div
      className={classNames({
        todo: !todo.completed,
        'todo completed': todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            handleCheck(todo.id);
          }}
        />
      </label>

      <span className="todo__title">{todo?.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
