import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { SetStateAction } from 'react';
import { Loader } from '../Loader/Loader';

type Props = {
  isHover: boolean;
  deletedTodoId: number | null;
  setIsHover: React.Dispatch<SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
  todo: Todo;
  isTempTodo: boolean;
};

export const TodoItem: React.FC<Props> = ({
  isHover,
  deletedTodoId,
  setIsHover,
  handleDelete,
  todo: { id, title, completed },
  isTempTodo,
}) => {
  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      data-cy="Todo"
      key={id}
      className={classNames('todo', { completed: completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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

      <button
        type="button"
        className={classNames('todo__remove', {
          'is-active': !isHover,
        })}
        data-cy="TodoDelete"
        onClick={() => {
          handleDelete(id);
        }}
      >
        ×
      </button>
      <Loader isActive={isTempTodo || deletedTodoId === id} />
    </div>
  );
};
