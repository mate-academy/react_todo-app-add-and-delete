/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isSubmiting: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, isSubmiting }) => {
  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isSubmiting })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
