import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (userId: number) => void,
  isLoading: boolean,
};

export const TodoInfo: React.FC<Props> = ({ todo, deleteTodo, isLoading }) => {
  const { completed, title, id } = todo;
  const [checked, setChecked] = useState(completed);

  return (
    <>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={checked}
          onChange={() => {
            setChecked(!checked);
          }}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          deleteTodo(id);
        }}
      >
        ×
      </button>

      <div className={
        classNames(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )
      }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
