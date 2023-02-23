import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (id: number) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({ todo, removeTodo }) => (
  <>
    {todo.completed ? (
      <div className="todo completed">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked
          />
        </label>

        <span className="todo__title">{todo.title}</span>

        <button
          type="button"
          className="todo__remove"
        >
          ×
        </button>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ) : (

      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span className="todo__title">{todo.title}</span>
        <button
          type="button"
          className="todo__remove"
          onClick={() => (removeTodo(todo.id))}
        >
          ×
        </button>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </>
);
