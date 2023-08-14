import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <li
      className={classNames('todo', {
        completed,
        editing: isEditing,
      })}
      key={id}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          id={`toggle-view-${id}`}
        />
        <label onDoubleClick={handleDoubleClick} htmlFor={`toggle-view-${id}`}>
          {title}
        </label>
        <button
          type="button"
          className="destroy"
          aria-label="Delete Todo"
        />
      </div>
      <input
        type="text"
        className="edit"
      />
    </li>
  );
};
