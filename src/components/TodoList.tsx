import React from 'react';
import { Todo } from '../types/Todo';

interface TodoListProps {
  filteredTodos: Todo[];
  handleToggleTodoStatus: (id: number, completed: boolean) => Promise<void>;
  handleDeleteTodo: (id: number) => Promise<void>;
  loadingTodoIds: number[];
  isAddingTodo: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  handleToggleTodoStatus,
  handleDeleteTodo,
  loadingTodoIds,
  isAddingTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={`todo ${todo.completed ? 'completed' : ''}`}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onChange={() => handleToggleTodoStatus(todo.id, todo.completed)}
              disabled={loadingTodoIds.includes(todo.id)}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={`modal overlay ${loadingTodoIds.includes(todo.id) ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {isAddingTodo && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </section>
  );
};
