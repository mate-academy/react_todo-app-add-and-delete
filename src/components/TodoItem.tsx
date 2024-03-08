import { useCallback } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type TodoItemProps = {
  todo: Todo;
  addingTodoId: number | null;
  setAddingTodoId: (id: number | null) => void;
  handleDelete: (id: number) => void;
  setError: (error: string) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  addingTodoId,
  setAddingTodoId,
  handleDelete,
  setError,
}) => {
  const { title, completed, id } = todo;

  const onDeleteClick = useCallback(() => {
    if (typeof id === 'number') {
      setAddingTodoId(id);
      deleteTodo(id)
        .then(() => handleDelete(id))
        .catch(() => {
          setError('Unable to delete a todo');
          setAddingTodoId(null);
        });
    }
  }, [id, setAddingTodoId, handleDelete, setError]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDeleteClick}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': id === addingTodoId })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
