/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo as TodoType } from '../types/Todo';

interface TodoProps {
  todo: TodoType;
  onDeleteTodo: (id: number) => void;
}

const TodoItem: React.FC<TodoProps> = ({ todo, onDeleteTodo }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = async () => {
    setDeleting(true);
    try {
      await onDeleteTodo(todo.id);
    } catch (error) {
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
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
        onClick={handleDeleteClick}
        disabled={deleting}
      >
        {deleting ? 'Deleting...' : '×'}
      </button>
      {deleting && (
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

export default TodoItem;
