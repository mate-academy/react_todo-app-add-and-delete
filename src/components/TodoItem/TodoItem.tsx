import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  todoAction: number[];
};

export const TodoItem: React.FC<Props> = (
  {
    todo,
    removeTodo,
    todoAction,
  },
) => {
  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo', {
          completed: todo.completed,
        },
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

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      {todoAction.length > 0 && (
        <div
          data-cy="TodoLoader"
          className={classNames(
            'modal overlay',
            {
              'is-active': todoAction.includes(todo.id),
            },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
