import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void;
  tempTodo: Todo | null,
};

export const Todos: React.FC<Props> = ({
  todos,
  onDelete = () => {},
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {tempTodo && (
        <div
          className={classNames('todo', 'loading')}
          key={tempTodo.id}
        >
          <span className="loader" />
        </div>
      )}
      {todos.map((todo) => (
        <div
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
