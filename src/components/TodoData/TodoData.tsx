import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  deletingTodosId: number[];
};

export const TodoData: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  deletingTodosId,
}) => {
  const { id, title, completed } = todo;

  // eslint-disable-next-line
  console.log(deletingTodosId);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      {deletingTodosId.includes(id) && <Loader />}

    </div>
  );
};
