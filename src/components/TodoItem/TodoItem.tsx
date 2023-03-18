import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (id: number) => void,
  removedTodoId: number | null
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  removedTodoId,
}) => {
  const { id, title } = todo;
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  const toggleCompletedStatus = () => {
    setIsCompleted(prev => !prev);
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed: isCompleted },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={toggleCompletedStatus}
        />
      </label>
      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      {removedTodoId === id && (
        <div className="overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
