import React from 'react';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';

type Props = {
  todos: Todo[];
  toggleTodo: (todo: Todo) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({ todos, toggleTodo, isLoading }) => {
  return (
    <>
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={`todo ${todo.completed && `completed`}`}
          key={todo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <Loader isLoading={isLoading} />
        </div>
      ))}
    </>
  );
};
