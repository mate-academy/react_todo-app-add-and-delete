import React from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (id: number) => void,
};

export const TodoList: React.FC<Props> = ({ todos, handleDeleteTodo }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          key={todo.id}
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>
          <span className="todo__title">{todo.title}</span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {/* This edited form is shown instead of the title and remove button
      <form>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form> */}

      {/* 'is-active' class puts this modal on top of the todo
      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div> */}
    </section>
  );
};
