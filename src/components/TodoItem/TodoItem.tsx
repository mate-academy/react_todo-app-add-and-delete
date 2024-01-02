import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoader: boolean,
  deleteTodo: (value: number) => void,
  isIdDelete: number | null,
  arryDelete: number[] | null,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoader,
  deleteTodo,
  isIdDelete,
  arryDelete,
}) => {
  const { id, title, completed } = todo;
  const deleteID = () => {
    deleteTodo(id);
  };

  const findIdIsLoader = () => {
    if (arryDelete) {
      return arryDelete.find(item => item === id);
    }

    return false;
  };

  return (
    <>
      <div
        key={id}
        data-cy="Todo"
        className={classNames('todo', {
          completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={deleteID}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': findIdIsLoader()
            || (isLoader && isIdDelete === id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
