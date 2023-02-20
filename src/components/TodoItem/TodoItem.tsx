import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onTodoDelete: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodoDelete,
}) => {
  const [todoId, setTodoId] = useState(0);

  const handleTodoDelete = (id: number) => {
    onTodoDelete(id);
    setTodoId(id);
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          if (todo.id) {
            handleTodoDelete(todo.id);
          }
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames(
        'modal overlay',
        {
          'is-active': todoId === todo.id,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
