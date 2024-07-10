/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  selectedTodo: number;
  doneTask: boolean;
  onDeleteTodo: (val: number) => void;
  onSelectedTodo: (val: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodo,
  doneTask,
  onDeleteTodo,
  onSelectedTodo,
}) => {
  const { completed, title, id } = todo;

  const removeById = () => {
    onSelectedTodo(todo.id);
    onDeleteTodo(todo.id);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
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
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={removeById}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('overlay modal', {
          'is-active':
            id === 0 || selectedTodo === id || (doneTask && completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
