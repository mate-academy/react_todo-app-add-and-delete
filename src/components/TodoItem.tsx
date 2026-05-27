/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (todoId: number) => void;
  loadingTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodo,
  deleteTodo,
  loadingTodoId,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter">
          <div className="loader" />
        </div>
      </div>
    </div>
  );
};
