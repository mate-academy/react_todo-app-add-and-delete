import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDeleteTodo: (tId: number) => Promise<number>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
}) => {
  const handleDelete = (tId: number) => {
    onDeleteTodo(tId);
  };

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
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
        data-cy="TodoDelete"
        onClick={() => {
          handleDelete(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={
          (todo.id === 0)
            ? 'modal overlay is-active'
            : 'modal overlay'
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
