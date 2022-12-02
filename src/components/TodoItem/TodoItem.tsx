import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  activeTodoID: number;
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete, activeTodoID }) => {
  const { id, title } = todo;
  const [checked, setChecked] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: checked })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', { 'is-active': id === activeTodoID })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
