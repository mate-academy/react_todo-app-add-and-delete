import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';
import { ERROR_MESSAGES, ErrorMessage } from '../../types/ErrorMessages';

type TodoItemProps = {
  todo: Todo;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  processingIds: number[];
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage?: (errorMessage: ErrorMessage) => void;
  focusInput?: () => void;
};

export const TodoItem = ({
  todo,
  setProcessingIds,
  processingIds,
  setTodos,
  setErrorMessage,
  focusInput,
}: TodoItemProps) => {
  const isProcessing = processingIds.includes(todo.id);

  const handleDeleteButton = (id: number): void => {
    if (processingIds.includes(id)) {
      return;
    }

    setProcessingIds(prevIds => [...prevIds, id]);
    deleteTodos(id)
      .then(() => {
        setTodos?.(prevTodos => prevTodos.filter(t => t.id !== id));
      })
      .catch(() => {
        setErrorMessage?.(ERROR_MESSAGES.DELETE_FAIL);
      })
      .finally(() => {
        setProcessingIds(prevState =>
          prevState.filter(todoId => todoId !== id),
        );
        focusInput?.();
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleDeleteButton(todo.id);
        }}
        disabled={isProcessing}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
