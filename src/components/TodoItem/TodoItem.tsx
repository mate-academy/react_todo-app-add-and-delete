import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo: (value: number) => void;
  loading: boolean;
  isTodoId?: number[] | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  loading,
  isTodoId,
}) => {
  const { completed, title, id } = todo;
  const deletedTodos = isTodoId?.some(todoId => todoId === id);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDeleteTodo(id)}
      >
        ×
      </button>

      {isTodoId ? (
        <div className={classNames('modal overlay', {
          'is-active': deletedTodos,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      ) : (
        <div className={classNames('modal overlay', {
          'is-active': loading,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}

    </div>
  );
};
