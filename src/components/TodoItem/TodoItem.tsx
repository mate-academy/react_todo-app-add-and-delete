import classNames from 'classnames';

type Props = {
  id: number;
  completed: boolean;
  title: string;
  deleteTodo?: (deletedPostId: number) => void;
  selectedTodo: number;
  setSelectedTodo?: React.Dispatch<React.SetStateAction<number>>;
};

export const TodoItem: React.FC<Props> = ({
  id,
  completed,
  title,
  deleteTodo,
  selectedTodo,
  setSelectedTodo,
}) => {
  let handleDelete = () => {};

  if (deleteTodo && setSelectedTodo) {
    handleDelete = () => {
      setSelectedTodo(id);
      deleteTodo(id);
    };
  }

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })} key={id}>
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
        onClick={handleDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': id === selectedTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
