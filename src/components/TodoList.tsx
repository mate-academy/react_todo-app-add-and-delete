/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  visibleTodos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  setTodos,
  todos,
  tempTodo,
  onDelete,
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
                      t.id === todo.id ? { ...t, completed: !t.completed } : t
                    )
                  );
                }}
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
                onDelete(todo.id)
              }}
            >
              x
            </button>

            {/* Overlay для реальних todo – без is-active */}
            <div data-cy="TodoLoader" className={`modal overlay ${todo.isDeleting ? 'is-active' : ''}`}>
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {/* Temp todo відображається окремо з Loader і класом is-active */}
      {tempTodo && (
        <div data-cy="Todo" className="todo" key={tempTodo.id}>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
