/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import React from 'react';

import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  onDelete: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  onDelete,
  onToggle,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <div
        key={todo.id}
        data-cy="Todo"
        className={cn('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => onToggle(todo)}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': loadingTodoIds.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ))}
  </section>
);
