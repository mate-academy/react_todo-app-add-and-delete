/* eslint-disable react/jsx-fragments */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onRemove: (todoId: number) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <React.Fragment key={todo.id}>
          <div
            className={classNames(
              'todo',
              { completed: todo.completed },
            )}
          >
            <label
              className="todo__status-label"
            >
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
              />
            </label>
            <span
              className="todo__title"
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                onRemove(todo.id);
              }}
            >
              ×
            </button>
          </div>
        </React.Fragment>
      ))}
    </section>
  );
};
