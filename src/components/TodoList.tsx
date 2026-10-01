/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoId: number | null;
  updatingTodoId: number | null;
  onToggle: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  onRename: (todoId: number, title: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoId,
  updatingTodoId,
  onToggle,
  onDelete,
  onRename,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        deletingTodoId={deletingTodoId}
        updatingTodoId={updatingTodoId}
        onToggle={onToggle}
        onDelete={onDelete}
        onRename={onRename}
      />
    ))}

    {tempTodo && (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo.title}
        </span>

        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
