import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onTodoRemove: (todoId: number) => void;
  isRemovingCompleted: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodoRemove,
  isRemovingCompleted,
}) => {
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const isNewTodo = todo.id === 0;

  const isRemovingCompletedTodo = isRemovingCompleted && todo.completed;
  const isLoading = isNewTodo || isRemoving || isRemovingCompletedTodo;

  const handleRemoveTodo = () => {
    onTodoRemove(todo.id);
    setIsRemoving(true);
  };

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
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleRemoveTodo}
      >
        ×
      </button>

      <div className={classNames(
        'modal', 'overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
