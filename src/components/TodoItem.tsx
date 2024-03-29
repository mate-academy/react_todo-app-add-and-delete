import { useEffect, useState } from 'react';

type Props = {
  title: string;
  id: number;
  completed: boolean;
  loader: boolean;
  deleteCurrentTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  title,
  id,
  completed,
  loader,
  deleteCurrentTodo,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loader);
  }, [loader]);

  return (
    <div
      key={id}
      data-cy="Todo"
      className={`todo ${completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          aria-label="Status todo"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteCurrentTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
