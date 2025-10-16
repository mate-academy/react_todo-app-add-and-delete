import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  isLoading: boolean;
  deletedTodo: (idTodo: number) => void;
  setIsLoading: (p: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToggle,
  isLoading,
  deletedTodo,
  setIsLoading,
}) => {
  const handleToggleComplete = () => {
    onToggle(todo.id, !todo.completed);
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={isLoading}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          setIsLoading(true);
          deletedTodo(todo.id);
          setIsLoading(false);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
