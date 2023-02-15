import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onChange: (toggledTodo: Todo) => void,
  onClick: (todoId: number) => void,
  processedTodos: number[],
};

export const Main: React.FC<Props> = ({
  todos,
  onChange,
  onClick,
  processedTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => onChange(todo)}
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onClick(todo.id)}
          >
            ×
          </button>

          {false && (
            <form>
              <input
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>
          )}

          <div className={classNames('modal overlay', {
            'is-active': processedTodos.includes(todo.id),
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
