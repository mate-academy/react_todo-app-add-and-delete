import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loading?: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {loading && <div>Загрузка...</div>}

      {todos.map(todo => (
        <div
          key={todo.id}
          className={`todo ${todo.completed ? 'completed' : ''}`}
          data-cy="Todo"
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              readOnly
              data-cy="TodoStatus"
            />
          </label>
          <span className="todo__title" data-cy="TodoTitle">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay" />
        </div>
      ))}

      {tempTodo && (
        <div key={0} className="todo loading" data-cy="Todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" disabled />
          </label>
          <span className="todo__title" data-cy="TodoTitle">
            {tempTodo.title}
          </span>
          <div data-cy="TodoLoader" className="modal overlay is-active" />
        </div>
      )}
    </section>
  );
};
