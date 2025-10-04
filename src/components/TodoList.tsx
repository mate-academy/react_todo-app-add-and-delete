/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  visibleTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  setTodos,
  todos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const checkboxId = `todo-${todo.id}`;

        return (
          <div
            data-cy="Todo"
            className={todo.completed ? 'todo completed' : 'todo'}
            key={todo.id}
          >
            <label className="todo__status-label" htmlFor={checkboxId}>
              <input
                id={checkboxId}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => {
                  setTodos(
                    todos.map(t =>
                      t.id === todo.id ? { ...t, completed: !t.completed } : t,
                    ),
                  );
                }}
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
                setTodos(todos.filter(t => t.id !== todo.id));
              }}
            >
              x
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
