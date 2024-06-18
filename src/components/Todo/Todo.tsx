import { useEffect, useState } from 'react';
import { TodoProps } from '../../types/ComponentsProps';

export const Todo: React.FC<TodoProps> = ({ todo, deleteTodo }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (todo.id === 0) {
      setIsLoading(true);
    }
  }, [todo.id]);

  const handleDelete = () => {
    setIsLoading(true);
    deleteTodo(todo.id);
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={`todo ${todo.completed ? 'completed' : ''}`}
        key={todo.id}
      >
        <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
          <input
            id={`todo-${todo.id}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={`modal overlay ${isLoading ? 'is-active' : ''} `}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
