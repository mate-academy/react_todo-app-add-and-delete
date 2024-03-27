/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  todo: Todo;
  setPreparedTodos: (e: Todo[]) => void;
  isLoading: number | null;
  setIsLoading: (e: number | null) => void;
  setErrorMessage: (m: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todos,
  todo,
  setPreparedTodos,
  isLoading,
  setIsLoading,
  setErrorMessage,
}) => {
  const handleDeleteTodo = () => {
    setIsLoading(todo.id);

    deleteTodo(todo.id)
      .then(() => {
        setPreparedTodos(
          todos.filter(currentTodo => currentTodo.id !== todo.id),
        );
      })
      .catch(() => {
        setErrorMessage(`Unable to delete a todo`);
      })
      .finally(() => setIsLoading(null));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label htmlFor="status" className="todo__status-label">
        <input
          id="status"
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
        onClick={() => handleDeleteTodo()}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
