/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  deleteTodo?: (todoId: number) => void;
  toggleTodoStatus?: (todoId: number) => Promise<void>;
};

export const TodoCard: React.FC<Props> = ({
  todo,
  deleteTodo = () => {},
  toggleTodoStatus = () => {},
}) => {
  const [isActiveLoader, setisActiveLoader] = useState(false);

  const handleDelete = async () => {
    setisActiveLoader(true);
    try {
      await deleteTodo?.(todo.id);
    } finally {
      setisActiveLoader(false);
    }
  };

  const handleTodoStatus = async () => {
    setisActiveLoader(true);
    try {
      await toggleTodoStatus?.(todo.id);
    } finally {
      setisActiveLoader(false);
    }
  };

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleTodoStatus}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <TodoLoader isActiveLoader={todo.id === 0 || isActiveLoader} />
    </div>
  );
};
