import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  formList: Todo;
  deleteToDo: (userId: number) => void;
}

export const MainList: React.FC<Props> = ({ formList, deleteToDo }) => {
  const { title, completed, id } = formList;

  const handleClick = () => {
    deleteToDo(id);
  };

  return (
    <>
      <div className={`todo ${completed ? 'completed' : ''}`}>
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span
          className="todo__title"
        >
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          onClick={handleClick}
        >
          ×
        </button>

        {/* {formList.isLoading && (
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )} */}
      </div>
    </>
  );
};
