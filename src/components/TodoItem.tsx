import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete }) => {
  const handleDeleteClick = () => {
    onDelete(todo.id);
  };

  return (
    <>
      <section className="todoapp__main">
        <div
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteClick}
          >
            ×
          </button>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      </section>
    </>
  );
};
