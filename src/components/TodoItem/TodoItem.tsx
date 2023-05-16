import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  isCompleted: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isCompleted,
}) => {
  const [detedTodoId, setDeletedTodoId] = useState(0);

  const handleDeleteTodo = (id: number) => {
    setDeletedTodoId(id);
    onDeleteTodo(id);
  };

  const isActive = detedTodoId === todo.id || isCompleted;

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×

      </button>

      <div className={cn('modal', 'overlay', {
        'is-active': isActive,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
