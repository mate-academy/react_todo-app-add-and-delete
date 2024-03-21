import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  todos: Todo[];
  setTodos: (value: React.SetStateAction<Todo[]>) => void;
  isLoading: number[];
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setError: (value: React.SetStateAction<string>) => void;
  setIsErrorShown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  isLoading,
  setIsLoading,
  setError,
  setIsErrorShown,
}) => {
  const handleRemove = (todoId: number) => {
    async function getDeleted() {
      setIsLoading([todoId]);

      try {
        await deleteTodo(todoId);
        setTodos(todos.filter(t => t.id !== todoId));
      } catch {
        setTodos(todos);
        setError('Unable to delete a todo');
        setIsErrorShown(true);
      } finally {
        setIsLoading([]);
      }
    }

    getDeleted();
  };

  return (
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
        onClick={() => handleRemove(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
