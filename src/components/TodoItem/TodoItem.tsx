import cn from 'classnames';
import { useState } from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoID: number) => void;
  isProcessing: Todo | null,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isProcessing,
}) => {
  const [todoIsCompleted, setTodoIsCompleted] = useState(false);

  const handleTodoDelete = (todoId: number) => {
    onDelete(todoId);
  };

  const handleToggleStatusChange = () => {
    setTodoIsCompleted((prevStatus) => !prevStatus);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todoIsCompleted })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoIsCompleted}
          onChange={handleToggleStatusChange}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleTodoDelete(todo.id)}
      >
        ×
      </button>

      {isProcessing && (
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isProcessing.id === todo.id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
