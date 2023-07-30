import React from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo,
  deleteTodoHandler: (todoId: number) => void,
  tempTodo: Todo | null;
};

export const TodoItem: React.FC<Props> = (
  {
    todo, deleteTodoHandler, tempTodo,
  },
) => {
  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        onClick={() => deleteTodoHandler(todo.id)}
        type="button"
        className="todo__remove"
      >
        ×

      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames('modal overlay', {
        'is-active': tempTodo !== null,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
