import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isProcessed: boolean; // Очікуємо вже обчислений булевий стан
  onDelete: () => void;
}

export const TodoItem: React.FC<Props> = ({ todo, isProcessed, onDelete }) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      {/* ... інший код ... */}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDelete} // <--- додайте обробник сюди
      >
        ×
      </button>

      {/* Оверлей з лоадером */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isProcessed ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
