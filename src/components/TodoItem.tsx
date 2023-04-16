import classNames from 'classnames';
import '../styles/todo.scss';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (value: number) => void,
  loadingTodo: number[]
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  loadingTodo,
}) => {
  const { id, title, completed } = todo;

  return (
    <div className={classNames(
      'todo',
      { completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>
      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>
      <div
        className={classNames(
          'modal overlay',
          { 'is-active': loadingTodo.includes(id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
