/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from '../Loader/Loader';

interface Props {
  todo: Todo
  removeTodo: (todoId: number) => void
}

export const TodoItem: React.FC<Props> = ({ todo, removeTodo }) => {
  const { completed, title } = todo;
  const [selected, setSelected] = useState<number | null>(null);

  const handleDeleted = (id: number) => {
    setSelected(id);
    removeTodo(id);
  };

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>
      {/* <form>
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                />
              </form> */}
      <span className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleted(todo.id)}
      >
        ×
      </button>
      {/* overlay will cover the todo while it is being updated */}
      {todo.id === selected && <Loader />}
    </div>
  );
};
