import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { DeletingTodo } from '../../types/DeletingTodo';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void,
  deletingTodos: DeletingTodo[],
};

export const TodoTask: React.FC<Props> = ({
  todo,
  onDelete,
  deletingTodos,
}) => {
  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay', {
          'is-active': deletingTodos.find(({ todoId }) => (
            todoId === todo.id))?.isDeleting,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
