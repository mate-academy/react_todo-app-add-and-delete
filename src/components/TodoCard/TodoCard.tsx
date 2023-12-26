import { useTodoContext } from '../../context/TodosProvider';
import { Todo } from '../../types/Todo';

interface TodoCardProps {
  todo: Todo
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const { handleDeleteTodo, tempTodo } = useTodoContext();

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''} `}>
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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className={`modal overlay ${todo.id === tempTodo?.id ? 'is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
