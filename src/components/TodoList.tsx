import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  loading: boolean;
  onDelete: (todoId: number) => void;
  processingIds: number[];
  tempTodo: Todo | null;
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  loading,
  onDelete,
  processingIds,
  tempTodo,
  todos,
}) => {
  if ((todos.length === 0 && !tempTodo) || loading) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={`todo ${todo.completed ? 'completed' : ''}`}
        >
          <span className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              readOnly
            />
          </span>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            &times;
          </button>

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${processingIds.includes(todo.id) ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" key={tempTodo.id} className="todo">
          <span className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              readOnly
            />
          </span>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            &times;
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
