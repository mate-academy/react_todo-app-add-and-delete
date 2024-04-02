import cn from 'classnames';

import { useTodos } from '../context/TodosContext';

import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
};

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const { removeTodo, handleCheck } = useTodos();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    await removeTodo(todo.id);
    setIsLoading(true);
  };

  const inputId = `todo-status-${todo.id}`;

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label htmlFor={inputId} className="todo__status-label">
        <input
          aria-label="TodoStatus"
          id={inputId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCheck(todo)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleRemove}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
