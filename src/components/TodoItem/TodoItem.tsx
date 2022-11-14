import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  isAdding: boolean;
  deleteTodoAtServer?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  deleteTodoAtServer,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const handleClick = () => {
    if (deleteTodoAtServer) {
      deleteTodoAtServer(id);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleClick}
      >
        ×
      </button>
      <Loader isAdding={isAdding} />
    </div>
  );
};
