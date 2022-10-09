import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

interface Props {
  todoItem: Todo,
  selectedTodo: number[];
  handleDelete: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todoItem,
  selectedTodo,
  handleDelete,
}) => {
  const {
    title,
    completed,
    id,
  } = todoItem;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
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
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <TodoLoader selectedTodo={selectedTodo} id={id} />
    </div>
  );
};
