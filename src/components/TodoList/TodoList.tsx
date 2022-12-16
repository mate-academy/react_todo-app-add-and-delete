import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Title = {
  title?: null | string
};

type Props = {
  todos: Todo[],
  visibleTodos: Todo[],
  handleClick: (id: number, completed: boolean) => void,
  handleRemoveTodo: (id: number) => void,
  tempTodo: Title
};

export const TodoList: React.FC<Props> = ({
  todos, visibleTodos, handleClick, handleRemoveTodo, tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0
        && (
          visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed,
              })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  onClick={() => handleClick(todo.id, todo.completed)}
                />
              </label>

              <span
                data-cy="TodoTitle"
                className="todo__title"
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => handleRemoveTodo(todo.id)}
              >
                ×
              </button>

              <div data-cy="TodoLoader" className="modal overlay">
                {/* eslint-disable-next-line max-len */}
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))
        )}
      {tempTodo.title !== null
        && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title || null}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
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
