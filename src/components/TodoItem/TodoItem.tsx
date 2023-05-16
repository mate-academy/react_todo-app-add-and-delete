import cn from 'classnames';
import {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
} from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
}
export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  setTodos,
  setError,
}) => {
  const [isTodoDeleting, setIsTodoDeleting] = useState(false);

  const handleTodoDelete = useCallback(async () => {
    setIsTodoDeleting(true);

    try {
      await deleteTodo(todo.id);
      setTodos((prevTodos) => prevTodos
        .filter((currentTodo) => currentTodo.id !== todo.id));
    } catch (error) {
      setError(`Error ${error}`);
    } finally {
      setIsTodoDeleting(false);
    }
  }, [todo.id, setTodos, setError]);

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" checked />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleTodoDelete}
      >
        ×
      </button>

      <div
        className={cn('modal', 'overlay', {
          'is-active': isLoading || isTodoDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
