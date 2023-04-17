import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deletingTodoId: number,
  isDeletingCompleted: boolean,
  onRemoveTodo: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletingTodoId,
  isDeletingCompleted,
  onRemoveTodo,
}) => {
  const isTodoChanging = (todo.id === 0
    || deletingTodoId === todo.id
    || (isDeletingCompleted && todo.completed));

  return (
    <div
      key={todo.id}
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => onRemoveTodo(todo.id)}
      >
        ×
      </button>
      <div className={classNames(
        'modal overlay',
        {
          'is-active': isTodoChanging,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
