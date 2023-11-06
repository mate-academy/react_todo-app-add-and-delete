import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  removeTodo: (itemId: number) => void;
  updateTodo: (itemId: number, completed: boolean) => void;
  isLoading?: boolean;
};

const TodoItem = ({
  todo, updateTodo, removeTodo, isLoading,
}: TodoItemProps) => {
  return (
    <div key={todo.id} className={`todo ${todo.completed && 'completed'}`}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onChange={() => updateTodo(todo.id, todo.completed)}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={`modal overlay ${isLoading && 'is-active'}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
