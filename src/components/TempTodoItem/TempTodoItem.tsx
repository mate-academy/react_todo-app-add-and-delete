import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo;
  isLoading?: boolean;
};

export const TempTodoItem: React.FC<Props> = ({ todo, isLoading }) => {
  const { completed, title } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      {isLoading && <Loader />}
    </div>
  );
};
