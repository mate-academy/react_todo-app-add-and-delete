import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (url: number) => void;
  processingIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  processingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return (
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
            })}
            key={todo.id}
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              className="todo__status-label"
              htmlFor={`todo-status-${todo.id}`}
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

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                deleteTodo(todo.id);
              }}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={classNames('modal', 'overlay', {
                'is-active': processingIds.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: tempTodo.completed,
          })}
          key={tempTodo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            className="todo__status-label"
            htmlFor={`todo-status-${tempTodo.id}`}
          >
            <input
              id={`todo-status-${tempTodo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              deleteTodo(tempTodo.id);
            }}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', {
              'is-active': true,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
