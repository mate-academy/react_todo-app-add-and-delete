import React from 'react';
import '../styles/index.scss';
import { Todo } from '../types/Todo';
import { TempTodo } from './TodosList/TempTodo/TempTodo';

type Props = {
  preparedTodos: Todo[];
  deleteTodo: (todoId: number) => void;
  deletingTodos: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  deleteTodo,
  deletingTodos,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos.map(todo => (
        <div
          data-cy="Todo"
          className={todo.completed ? 'todo completed' : 'todo'}
          key={todo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {}}
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
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={
              deletingTodos.includes(todo.id)
                ? 'modal overlay is-active'
                : 'modal overlay'
            }
          >
            {/* eslint-disable-next-line max-len */}
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      <TempTodo tempTodo={tempTodo} />
    </section>
  );
};
