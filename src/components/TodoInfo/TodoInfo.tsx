/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { FC } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  setIdsForDelete: React.Dispatch<React.SetStateAction<number[]>>;
  idsForDelete?: number[];
}

export const TodoInfo: FC<Props> = ({
  todo,
  idsForDelete,
  setIdsForDelete,
}) => (
  <>
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => setIdsForDelete(current => [...current, todo.id])}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': !todo.id || idsForDelete?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  </>
);
