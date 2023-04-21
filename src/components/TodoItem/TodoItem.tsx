import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isTempTodo: boolean;
  clearIsPressed?: boolean;
  removeTodo?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isTempTodo,
  clearIsPressed,
  removeTodo,
}) => {
  const { title, completed, id } = todo;
  const [isBeingRemoved, setIsBeingRemoved] = useState(false);
  const isLoaderCovered = (isTempTodo || isBeingRemoved)
    || (clearIsPressed && completed);

  const handleTodoRemove = () => {
    setIsBeingRemoved(true);

    if (removeTodo) {
      removeTodo(id);
    }
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleTodoRemove}
      >
        ×
      </button>

      {isLoaderCovered && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
