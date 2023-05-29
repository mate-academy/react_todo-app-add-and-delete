import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  deleteTodo: (id: number) => void,
  onUpdate: (id: number) => void,
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          key={todo.id}
          className={classNames(
            'todo',
            { completed: todo.completed },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              data-sy="TodoStatus"
              checked={todo.completed}
              onChange={() => {
                onUpdate(todo.id);
              }}
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>

          <div className={classNames(
            'modal overlay',
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
