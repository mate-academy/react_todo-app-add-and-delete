import { Todo } from '../../types/Todo';
import clsx from 'clsx';

type Props = {
  todoItem: Todo;
  removeTodo: (id: number) => void;
  complateTodo: (id: number) => void;
  deletingTodoId: number[] | null;
  isTemp?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todoItem,
  removeTodo,
  complateTodo,
  deletingTodoId,
  isTemp = false,
}) => {
  return (
    <div
      data-cy="Todo"
      className={clsx('todo', { completed: todoItem.completed })}
    >
      <label className="todo__status-label" htmlFor={String(todoItem.id)}>
        <input
          id={String(todoItem.id)}
          data-cy="TodoStatus"
          type="checkbox"
          className={clsx('todo__status')}
          checked={todoItem.completed}
          onChange={() => complateTodo(todoItem.id)}
        />
      </label>
      <span data-cy="TodoTitle" className={clsx('todo__title')}>
        {todoItem.title}
      </span>
      <button
        type="button"
        className={clsx('todo__remove')}
        data-cy="TodoDelete"
        onClick={() => removeTodo(todoItem.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={clsx('modal', 'overlay', {
          'is-active': isTemp || deletingTodoId?.includes(todoItem.id),
        })}
      >
        <div className={clsx('modal-background', 'has-background-white-ter')} />
        <div className={clsx('loader')} />
      </div>
    </div>
  );
};
