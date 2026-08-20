/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  checkedTodoCompleted: (id: number, completed: boolean) => void;
  removeTodo: (id: number) => void;
  deletingTodoId: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  checkedTodoCompleted,
  removeTodo,
  deletingTodoId,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => checkedTodoCompleted(todo.id, !todo.completed)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          deletingTodoId.includes(todo.id) ? 'is-active' : ''
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
