/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TypeNewTodo } from '../App';
import React from 'react';

export interface Props {
  todos: Todo[];
  NewTodo: TypeNewTodo | null;
  visibleTodos: Todo[];
  showLoader: (n: number) => void;
  LoderId: number;
  deletePost: (n: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  visibleTodos,
  NewTodo,
  LoderId,
  showLoader,
  deletePost,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 &&
        visibleTodos.map(todo => {
          return (
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed === true,
              })}
            >
              <label
                className="todo__status-label"
                htmlFor={`status-${todo.id}`}
              >
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  id={`status-${todo.id}`}
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => {
                  showLoader(todo.id);
                  deletePost(todo.id);
                }}
                data-cy="TodoDelete"
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': LoderId === todo.id,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        })}

      {NewTodo && (
        <div data-cy="Todo" className="todo">
          <label htmlFor="esseso" className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              id="esseso"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {NewTodo.title}
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
};
