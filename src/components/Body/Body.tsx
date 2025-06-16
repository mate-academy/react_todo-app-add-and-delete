import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleTodoDeleted: (todoId: number) => void;
  handleToggleCompleted: (todo: Todo) => void;
  isLoading: boolean;
  deleteId: number[];
};

export const Body: React.FC<Props> = ({
  todos,
  tempTodo,
  handleTodoDeleted,
  isLoading,
  handleToggleCompleted,
  deleteId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label
            className="todo__status-label"
            htmlFor={`TodoStatus-${todo.id}`}
          >
            <input
              aria-label="TodoStatus"
              id={`TodoStatus-${todo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleToggleCompleted(todo)}
              disabled={isLoading}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDeleted(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': deleteId.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo" key={0}>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
          <label className="todo__status-label">
            <input
              aria-label="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={false}
              disabled
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
        </div>
      )}
    </section>
  );
};
