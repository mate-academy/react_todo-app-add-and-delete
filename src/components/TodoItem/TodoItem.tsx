import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  updateTodo: (id: number, value: string, complete: boolean) => void,
  idTodo: number,
  deleteTodo: (value: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updateTodo,
  idTodo,
  deleteTodo,
}) => {
  const { title, completed, id } = todo;

  return (
    <li className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onChange={() => updateTodo(id, title, !completed)}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': idTodo === id },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
