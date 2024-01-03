import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  key: number;
  onRemove: (todoId: number) => void;
  removingTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  key,
  onRemove,
  removingTodoId,
}) => {
  const removing = removingTodoId === todo.id;

  return (
    <div key={key}>
      <div
        data-cy="Todo"
        className={cn(
          'todo',
          { completed: todo.completed },
        )}
        key={todo.id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onRemove(todo.id)}
        >
          ×
        </button>

        {removing && (
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </div>
  );
};
