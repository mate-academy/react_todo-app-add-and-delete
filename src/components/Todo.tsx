import React, { useState } from 'react';
import { Todo as TodoInterface } from '../types/Todo';

type Props = {
  todo: TodoInterface;
  deletePost: (v: number) => void;
  updatePost: (v: number, b: TodoInterface) => any;
  idOfLoading: number | null;
  arrayIdsOfLoading: number[];
};

export const Todo: React.FC<Props> = ({
  todo,
  deletePost,
  updatePost,
  idOfLoading,
  arrayIdsOfLoading,
}) => {
  const [inputChange, setInputChange] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const { id, title, completed } = todo;

  const handleComplied = () => {
    updatePost(id, {
      ...todo,
      completed: !completed,
    });
  };

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputChange(e.target.value);
  };

  const handleTitleBlur = () => {
    updatePost(id, {
      ...todo,
      title: inputChange,
    });
    setIsEditing(false);
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  const localLoading = idOfLoading === todo.id ? true : false;
  const localManyid = arrayIdsOfLoading.includes(todo.id);

  return (
    <div data-cy="Todo" className={`todo ${completed ? 'completed' : ''}`}>
      <label
        onClick={handleComplied}
        className="todo__status-label"
        htmlFor={`todo-checkbox-${id}`}
      >
        {/* Add the input element */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`todo-checkbox-${id}`}
          checked={completed}
          onChange={handleComplied}
        />
        {/* Add the custom checkbox */}
        <span className="custom-checkbox" />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          className="todo__title-field"
          type="text"
          value={inputChange}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyPress={handleTitleKeyPress}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleTitleDoubleClick}
        >
          {title}
        </span>
      )}

      <button
        onClick={() => deletePost(id)}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(localLoading || localManyid) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
