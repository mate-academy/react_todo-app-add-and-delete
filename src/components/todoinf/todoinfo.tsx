import classNames from 'classnames';

import { Todo } from '../enums/todo';

 type Props = {
   todo: Todo;
   onDelete: (id: number) => void;
   loadingTodo: number[]
 };

export const TodoInfo: React.FC<Props> = ({ todo, onDelete, loadingTodo }) => {
  const { completed, title, id } = todo;

  return (
    <li className={classNames('todo', { completed })}>
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
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        { 'is-active': loadingTodo.includes(id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
