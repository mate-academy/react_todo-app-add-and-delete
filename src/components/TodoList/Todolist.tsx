/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  loader: boolean;
  deleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todo, loader, deleteTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList" key={todo.id}>
      <div
        data-cy="Todo"
        className={`todo ${todo.completed ? 'completed' : ''}`}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
          disabled={loader}
        >
          ×
        </button>
      </div>
    </section>
  );
};
