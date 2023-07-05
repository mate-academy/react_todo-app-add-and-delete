import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onTodoDelete: (todoId: number) => void;
  deletedTodoId?: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodoDelete,
  deletedTodoId,
}) => {
  const handleRemoveTodo = async (todoId: number) => {
    onTodoDelete(todoId);
  };

  return (
    <div
      key={todo.id}
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleRemoveTodo(todo.id)}
      >
        ×
      </button>

      <div className={cn('modal overlay',
        { 'is-active': todo.id === 0 || deletedTodoId?.includes(todo.id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
