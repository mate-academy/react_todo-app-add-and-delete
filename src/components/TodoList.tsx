import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <div className="todo">
        <label
          className="todo__status-label"
          key={todo.id}
        >
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span className="todo__title">{todo.title}</span>
        <button type="button" className="todo__remove">×</button>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ))}
  </section>
);
