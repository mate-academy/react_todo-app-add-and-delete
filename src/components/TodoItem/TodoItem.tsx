import { useContext } from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/TodoContext';

type Props = {
  todo: Todo;
  onDelete: (value: number) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo, onDelete, isLoading,
}) => {
  const { setTodos } = useContext(TodoContext);
  const { id, title, completed } = todo;

  const handleComplete = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodos(prev => prev.map(currentTodo => {
      if (currentTodo.id === todo.id) {
        return { ...currentTodo, completed: event.target.checked };
      }

      return currentTodo;
    }));
  };

  return (
    <div
      data-cy="Todo"
      className={classnames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleComplete}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classnames(
          'modal overlay', {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
