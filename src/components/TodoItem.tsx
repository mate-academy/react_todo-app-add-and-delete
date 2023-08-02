import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  deleteId: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  deleteId,
}) => {
  const deleteItem = deleteId.includes(todo.id);

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(todo.id)}
      >
        x
      </button>

      <div className={classNames(
        'modal overlay', {
          'is-active': deleteItem,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
