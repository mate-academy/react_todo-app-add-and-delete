import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  deleteTodoAction: (todoId: number) => void,
  unActive: number | null,
}

export const Todoapp: React.FC<Props> = ({
  todos,
  deleteTodoAction,
  unActive,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(({ id, title, completed }) => (
      <div
        data-cy="Todo"
        className={cn('todo', { completed })}
        key={id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodoAction(id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn(
            'modal',
            'overlay',
            { 'is-active': unActive === id },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ))}
  </section>
);
