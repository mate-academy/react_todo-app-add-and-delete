import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  deleteTodo?: (id: number) => void
  changeTodo: (id: number, completed: boolean) => void
};

export const Item: React.FC<Props> = ({
  todo,
  deleteTodo,
  changeTodo,
}) => {
  function handleClick() {
    changeTodo(todo.id, !todo.completed);
  }

  const activeLoader = () => {
    if (deleteTodo) {
      deleteTodo(todo.id);
    }
  };

  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={handleClick}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={activeLoader}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
