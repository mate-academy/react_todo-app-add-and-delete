import {
  Dispatch, SetStateAction, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { ErrorTypes } from '../types/ErrorTypes';
import { Loader } from './Loader';

type Props = {
  index?: number | undefined,
  todo: Todo;
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  id: number;
  setError: Dispatch<SetStateAction<ErrorTypes | null>>;
};

export const TodoItem: React.FC<Props> = ({
  index, todo, setTodos, id, setError,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDestroy = async () => {
    try {
      setLoading(true);
      await deleteTodo(12177, id);
      if (index || index === 0) {
        setTodos(prevTodos => {
          return [
            ...prevTodos.slice(0, index),
            ...prevTodos.slice(index + 1),
          ];
        });
      }
    } catch {
      setError(ErrorTypes.DELETE_TODO);
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? <Loader /> : (
        <div
          data-cy="Todo"
          className={cn('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDestroy}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
