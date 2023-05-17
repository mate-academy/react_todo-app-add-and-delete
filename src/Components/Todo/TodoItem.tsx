import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  updatingTodoId?: number | null;
  isLoadingNewTodo?: boolean;
  isRemovingCompleted?: boolean;
  isUpdatingEveryStatus?: boolean;
  isEveryTotoCompleted?: boolean;
  onTodoRemove: (todoId: number) => void;
  onTodoUpdate: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updatingTodoId,
  isLoadingNewTodo,
  isRemovingCompleted,
  isUpdatingEveryStatus,
  isEveryTotoCompleted,
  onTodoRemove,
  onTodoUpdate,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const isUpdating = todo.id === updatingTodoId;
  const isRemovingAllCompleted = todo.completed && isRemovingCompleted;
  const isUpdatingEveryStatusTodo = (!todo.completed && isUpdatingEveryStatus)
  || (isEveryTotoCompleted && isUpdatingEveryStatus);
  const isWorkingLoader = isLoadingNewTodo
  || isRemoving
  || isRemovingAllCompleted
  || isUpdating
  || isUpdatingEveryStatusTodo;

  const handleRemoveTodo = useCallback(() => {
    onTodoRemove(todo.id);
    setIsRemoving(true);
  }, [todo, onTodoRemove]);

  const handleTodoUpdate = useCallback(() => {
    onTodoUpdate(todo);
  }, [todo, onTodoUpdate]);

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoUpdate}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleRemoveTodo}
        disabled={isWorkingLoader}
      >
        ×
      </button>

      <div className={classNames('modal', 'overlay', {
        'is-active': isWorkingLoader,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
