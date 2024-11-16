import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  loadingTodoId: number | null;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deleteTodo,
  loadingTodoId,
}) => (
  <div
    data-cy="Todo"
    className={`todo ${todo.completed ? 'completed' : ''}`}
    key={todo.id}
  >
    <label htmlFor="title" className="todo__status-label">
      {''}
      <input
        id="title"
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
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${loadingTodoId === todo.id ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
