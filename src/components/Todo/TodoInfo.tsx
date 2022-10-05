import classNames from 'classnames';
import { Loader } from '../Loader';

interface Props {
  title: string;
  completed: boolean;
  todoId: number;
  deleteTodo: (value: number) => void;
  isAdding: boolean;
}

export const TodoInfo: React.FC<Props> = ({
  title,
  completed,
  todoId,
  deleteTodo,
  isAdding,
}) => {
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

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          deleteTodo(todoId);
        }}
      >
        ×
      </button>

      {isAdding && (
        <Loader />
      )}
    </div>
  );
};
