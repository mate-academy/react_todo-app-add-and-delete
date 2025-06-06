import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  loadingTodoIds,
  tempTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => {
      const checkboxId = `todo-checkbox-${todo.id}`;

      return (
        <div
          key={todo.id}
          data-cy="Todo"
          className={`todo ${todo.completed ? 'completed' : ''}`}
        >
          <label htmlFor={checkboxId} className="todo__status-label">
            Mark complete
          </label>

          <input
            id={checkboxId}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            readOnly
          />

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={loadingTodoIds.includes(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': loadingTodoIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      );
    })}

    {tempTodo && (
      <div key="temp" data-cy="Todo" className="todo">
        <label htmlFor="temp-checkbox" className="todo__status-label">
          Mark complete
        </label>

        <input
          id="temp-checkbox"
          type="checkbox"
          className="todo__status"
          disabled
        />

        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo.title}
        </span>

        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
