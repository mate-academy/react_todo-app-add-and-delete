import { useState } from 'react';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

interface Props {
  todo: Todo;
  isTemp: boolean;
  handleDeleteTodo?: (id: number[]) => void;
}

export default function TodoItem({
  todo,
  isTemp = false,
  handleDeleteTodo,
}: Props) {
  const {
    completed, id, title,
  } = todo;

  const [isLoading, setIsLoading] = useState(isTemp);

  const handleDelete = (selectedId: number) => {
    if (handleDeleteTodo) {
      handleDeleteTodo([selectedId]);
      setIsLoading(true);
    }
  };

  return (
    <div className={`todo ${completed ? 'completed' : ''}`} key={id}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <div className={`modal overlay ${isLoading ? 'is-active' : ''}`}>
        <div className="modal-background
          has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
}
