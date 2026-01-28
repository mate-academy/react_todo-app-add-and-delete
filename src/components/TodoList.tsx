import React from 'react';
import { Todo, TodoFilter } from '../types/Todo';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  filter: TodoFilter;
  processings: Set<number>;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  filter,
  processings,
  onDelete,
}) => {
  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  readOnly
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              {!todo.isEditing && (
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => onDelete(todo.id)}
                  disabled={processings.has(todo.id)}
                >
                  ×
                </button>
              )}

              <div
                data-cy="TodoLoader"
                className={`modal overlay ${todo.loading ? 'is-active' : ''}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && (
            <div className="todo" data-cy="Todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={false}
                  disabled
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};
