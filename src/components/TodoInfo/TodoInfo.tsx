import cn from 'classnames';

import { useTodos } from '../context/TodosContext';

import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  isLoadingItem?: boolean;
};

export const TodoInfo: React.FC<Props> = ({ todo, isLoadingItem = false }) => {
  const { removeTodo, toggleOne } = useTodos();
  const [isLoading, setIsLoading] = useState(isLoadingItem);

  const inputId = `todo-status-${todo.id}`;

  const handleRemove = async () => {
    setIsLoading(true);
    await removeTodo(todo.id);
  };

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
          onChange={() => toggleOne(todo)}
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
