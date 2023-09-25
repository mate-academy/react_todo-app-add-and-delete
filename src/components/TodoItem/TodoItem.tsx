import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { CurrentError } from '../../types/CurrentError';

type Props = {
  todo: Todo,
  isClearCompleted: boolean,
  onDeleteTodo: (todoId: number) => void,
  onChangeStatus: (todoId: number) => void,
  onSetErrorMessage: (error: CurrentError) => void,
  setIsClearCompleted: (isClearCompleted: boolean) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isClearCompleted,
  onDeleteTodo,
  onChangeStatus,
  setIsClearCompleted,
}) => {
  const { completed, title } = todo;
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    onChangeStatus(todo.id);
  };

  const handleDelete = async () => {
    setIsLoading(true);

    await onDeleteTodo(todo.id);

    setIsLoading(false);
  };

  useEffect(() => {
    if (completed && isClearCompleted) {
      handleDelete();
    }

    setIsClearCompleted(false);
  }, [isClearCompleted]);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeStatus}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
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
