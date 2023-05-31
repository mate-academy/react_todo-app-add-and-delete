import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import '../../styles/todoItem.scss';

type TodoItemProps = {
  todo: Todo;
  onDelete:(id: number) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete }) => {
  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
