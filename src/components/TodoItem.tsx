import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Error';
import { deleteOnServer, updateOnServer } from '../api/todos';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setError: (value: ErrorType) => void;
  isUpdating: boolean
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  setError,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState<string>(todo.title);

  function deleteTodo(todoId: number) {
    const updatedTodos = todos.filter((td) => td.id !== todoId);

    setIsLoading(true);
    deleteOnServer(todoId)
      .catch(() => setError(ErrorType.Delete))
      .finally(() => {
        setIsLoading(false);
        setTodos(updatedTodos);
      });
  }

  function toggleComplete(id: number) {
    const updatedTodo = {
      ...todos.find((td) => td.id === id),
      completed: !todo.completed,
    } as Todo;

    setIsLoading(true);
    updateOnServer(updatedTodo)
      .catch(() => setError(ErrorType.Update))
      .finally(() => setIsLoading(false));

    const updatedTodos = todos.map((td) => {
      if (td.id === id) {
        return {
          ...td,
          completed: !td.completed,
        };
      }

      return td;
    });

    setTodos(updatedTodos);
  }

  return (
    <div>
      <div
        className={cn('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => toggleComplete(todo.id)}
          />
        </label>
        {isEditing ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
          </form>
        ) : (
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
        )}

        <button
          type="button"
          className="todo__remove"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>

        <div className={cn('modal overlay', {
          'is-active': isLoading || isUpdating || todo.id === 0,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </div>
  );
};
