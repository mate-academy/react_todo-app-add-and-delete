import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';

type Props = {
  todo: Todo;
  onRemoveTodo: (todoId: number) => void;
  isProcessing: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  isProcessing,
}) => {
  const { title, completed } = todo;

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
        onClick={() => onRemoveTodo(todo.id)}
      >
        ×
      </button>

      {isProcessing && <TodoLoader />}
    </div>
  );
};
