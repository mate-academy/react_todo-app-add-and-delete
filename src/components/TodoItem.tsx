import { MouseEventHandler, useContext } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { GlobalContext } from '../context/GlobalContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { completed, title, id } = todo;

  const { deleteTodo, isDelitingIds } = useContext(GlobalContext);

  const onRemoveHandler = (): MouseEventHandler<HTMLButtonElement> | void => {
    deleteTodo(id);
  };

  return (
    <>
      <div className={cn('todo', { completed })}>
        <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label>

        <span className="todo__title">{title}</span>

        <button
          type="button"
          className="todo__remove"
          onClick={() => onRemoveHandler()}
        >
          ×
        </button>

        <div className={
          cn('modal overlay', { 'is-active': isDelitingIds.includes(id) })
        }
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
