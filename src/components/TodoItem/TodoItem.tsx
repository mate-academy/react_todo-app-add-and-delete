import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteId: (id: number) => void,
  updateTodo: (updatedTodo: Todo) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo, deleteId, updateTodo, isLoading,
}) => {
  const { title } = todo;
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTodo = { ...todo, completed: event.target.checked };

    setIsCompleted(updatedTodo.completed);
    updateTodo(updatedTodo);
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames(
        'todo',
        { completed: isCompleted },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={handleCheckboxChange}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        { title }
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => !isLoading && deleteId(todo.id)}
        // Если индикатор загрузки не активен, переходит к следующей части.
        // Вызывается функция deleteId(todo.id)
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': todo.id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
