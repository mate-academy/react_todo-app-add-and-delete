import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  clearingCompleted: boolean,
  deletingTodo: Todo | undefined,
  deleteTodo: (n: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  clearingCompleted,
  deletingTodo,
  deleteTodo,
}) => {
  const { id, completed, title } = todo;

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn('todo', { completed })}
    >
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
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          {
            'is-active': id === 0
              || deletingTodo?.id === id
              || (clearingCompleted && completed),
          })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
