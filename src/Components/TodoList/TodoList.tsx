import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React from 'react';

interface TodoListProps {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  deleteData: (id: number) => void;
  deleteId: number[];
}

export const TodoList = ({
  filteredTodos,
  tempTodo,
  deleteData,
  deleteId,
}: TodoListProps) => {
  const handleDelete = (id: number) => {
    deleteData(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames(`todo ${todo.completed ? `completed` : ``}`)}
          key={todo.id}
        >
          <label
            className="todo__status-label"
            htmlFor={`todo-status-${todo.id}`}
            aria-label="Toggle todo status"
          >
            <input
              id={`todo-status-${todo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleDelete(todo.id);
            }}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': deleteId.includes(todo.id),
            })}
          >
            {/* eslint-disable-next-line max-len */}
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" htmlFor="temp-todo-status">
            <input
              id="temp-todo-status"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              aria-label="Toggle todo status"
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

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
