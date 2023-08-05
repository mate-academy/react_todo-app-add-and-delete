import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  loading: boolean,
  onDeleteTodo: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onDeleteTodo,
}) => {
  const handleDeleteClick = () => {
    onDeleteTodo(todo.id);
  };

  return (
    <li className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteClick}
        disabled={loading}
      >
        ×
      </button>

      {loading && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </li>
  );
};
