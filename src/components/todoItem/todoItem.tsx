import classNames from 'classnames';
import { useTodos } from '../../context/todoProvider';
import { Todo } from '../../types/Todo';

type Props = {
  task: Todo;
  handleDeleteClick: (id: number) => void;
};

export const TodoItem = ({ task, handleDeleteClick }: Props) => {
  const { deletingTask } = useTodos();

  return (
    <div
      key={task.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: task.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={task.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {task.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteClick(task.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletingTask.includes(task.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
