import React from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  onRemoveTodo: (todoId: number) => void
};

export const Todos: React.FC<Props> = ({
  todos,
  onRemoveTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div key={todo.id} className={`todo ${todo.completed && 'completed'}`}>
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
            onClick={() => onRemoveTodo(todo.id)}
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
