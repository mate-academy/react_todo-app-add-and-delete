import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

interface Props {
  todo: Todo;
  deleteTodo: (value: number) => void;
  isAdding: boolean;
  selectedIds: number[];
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  deleteTodo,
  isAdding,
  selectedIds,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo.completed,
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

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          deleteTodo(todo.id);
        }}
      >
        ×
      </button>

      {(selectedIds.includes(todo.id) || (isAdding && todo.id === 0)) && (
        <Loader />
      )}
    </div>
  );
};
