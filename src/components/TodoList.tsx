import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoListProps = {
  todos: Todo[];
  onChange: (id: number, completed: boolean) => void;
  handleDeleteTodo: (id: number) => Promise<void>;
  tempTodo: Todo | null;
  addTodo: boolean;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onChange,
  handleDeleteTodo,
  tempTodo,
  addTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
            <input
              id={`todo-${todo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={event => onChange(todo.id, event.target.checked)}
              disabled={addTodo && tempTodo?.id === todo.id}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
            disabled={addTodo && tempTodo?.id === todo.id}
          >
            ×
          </button>
          {/* Remove button appears only on hover */}

          {/* overlay will cover the todo while it is being deleted or updated */}
          {addTodo && tempTodo?.id === todo.id && (
            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ))}
    </section>
  );
};
