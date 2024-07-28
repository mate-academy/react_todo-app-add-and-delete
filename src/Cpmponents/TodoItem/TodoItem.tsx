/* eslint-disable */
import React, { useState, ChangeEvent } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import "./TodoItem.scss";


type Props = {
  todo: Todo;
  handleOnDelete: (todoId: number) => void;
  inProcess: number[];
  handleUpdate: (todoId: number, data: Partial<Todo>) => void;
};

const TodoItem: React.FC<Props> = ({ todo, handleOnDelete, inProcess, handleUpdate }) => {
  const { id, title, completed } = todo;
  const [textToEdit, setTextToEdit] = useState(title);
  const [isEdiing, setIsEditing] = useState(false);
  const isProcessing = inProcess.includes(id);

  const handleEdit = (event: ChangeEvent<HTMLInputElement>) => {
    setTextToEdit(event.target.value);
  };

  const handleSavings = () => {
    handleUpdate(id, { title: textToEdit });
    setIsEditing(false);
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdate(id, { completed: !completed })}
        />
      </label>
      <span
        data-cy="TodoTitle" className="todo__title"
        onDoubleClick={() => setIsEditing(true)}
      >
        {isEdiing ? (
          <input
            className="todo__edit"
            type="text"
            value={textToEdit}
            onChange={handleEdit}
            onBlur={handleSavings}
            autoFocus
          />
        ) : (
          <label>{title}</label>
        )}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleOnDelete(id)}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className={cn('modal overlay', {
        'is-active': isProcessing
      })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
