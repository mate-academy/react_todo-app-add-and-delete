import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onRemove: (todoId: number) => void;
  onTodoUpdate: (todo: Todo) => void;
  processedTodos: number[];
};

export const FormMain: React.FC<Props> = (
  {
    todos, onRemove, onTodoUpdate, processedTodos,
  },
) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
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
              checked={todo.completed}
              onChange={() => onTodoUpdate({
                ...todo,
                completed: !todo.completed,
              })}
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            onClick={() => onRemove(todo.id)}
          >
            ×
          </button>

          {/* processedTodos.includes(todo.id) */}

          {/* overlay will cover the todo while it is being updated */}
          <div className={classNames(
            'modal overlay',
            { 'is-active': processedTodos.includes(todo.id) },
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
