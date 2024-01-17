import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({ todo, deleteTodo }) => {
  const { title, completed, id } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >

      <label className="todo__status-label" id={todo.id.toString(10)}>
        <input
          data-cy="TodoStatus"
          id={todo.id.toString(10)}
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
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
