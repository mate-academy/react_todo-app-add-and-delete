import React from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoIds,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isDeleting={deletingTodoIds.includes(todo.id)}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && (
      <div data-cy="Todo" className={classNames('todo')}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={false}
            aria-label="Todo status"
            readOnly
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', 'is-active')}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
