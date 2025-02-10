import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteTodo?: (todoId: number) => void;
  isProcessed: boolean;
  tempTodo?: boolean;
};

const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  isProcessed,
  tempTodo,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
        <span className="visually-hidden">Mark as completed</span>
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo && handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isProcessed || tempTodo ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default React.memo(TodoItem);
