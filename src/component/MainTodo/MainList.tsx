import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  deleteToDo: (todoId: number) => void;
}

export const MainList: React.FC<Props> = ({ todo, deleteToDo }) => {
  const { title, completed, id } = todo;

  const handleClick = () => {
    deleteToDo(id);
  };

  return (
    <>
      <div className={`todo ${completed ? 'completed' : ''}`}>
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">{title}</span>

        <button type="button" className="todo__remove" onClick={handleClick}>
          ×
        </button>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
