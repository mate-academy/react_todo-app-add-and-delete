import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteId: (id: number) => void,
  updateTodo: (todo: Todo) => void,
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
      className={cn(
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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => !isLoading && deleteId(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
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
