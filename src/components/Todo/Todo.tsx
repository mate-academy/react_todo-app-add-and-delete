/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo as TypeTodo } from '../../types/Todo';

type Props = {
  todo: TypeTodo;
  handleDelete: (id: number[]) => void;
  toDelete: boolean;
};

export const Todo: React.FC<Props> = ({ todo, handleDelete, toDelete }) => {
  const checkTempTodo = (id: number) => {
    const TEMP_TODO_ID = 0;

    return id === TEMP_TODO_ID;
  };

  const isLoading = checkTempTodo(todo.id);

  return (
    <div data-cy="Todo" className={`todo ${todo.completed && 'completed'} `}>
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

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete([todo.id])}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading || toDelete ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
