/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todo as TodoInterface } from '../../types/Todo';
import classNames from 'classnames';

interface TodoProps {
  todo: TodoInterface;
  deletedTodoId: TodoInterface['id'];
  changeDeletedTodoId: (deletedTodo: number) => void;
  onDeleteTodo: (todoId: TodoInterface['id']) => void;
}

export const Todo: React.FC<TodoProps> = ({
  todo,
  deletedTodoId,
  changeDeletedTodoId,
  onDeleteTodo,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          return changeDeletedTodoId(todo.id), onDeleteTodo(todo.id);
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === deletedTodoId || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
