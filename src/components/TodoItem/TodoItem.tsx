import { useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { deleteTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  isActive?: boolean;
  setErrorMessage: (message: string) => void;
  removeDeletedTodo: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isActive,
  setErrorMessage,
  removeDeletedTodo,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteEvent = (id: number) => {
    const deletePromise = deleteTodo(id);

    setLoading(true);

    deletePromise
      .then(() => removeDeletedTodo(id))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {}}
          // 'TODO status change' logic to be implemented later
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      {/* 'TODO deletion' logic to be implemented later */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteEvent(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': isActive || loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
