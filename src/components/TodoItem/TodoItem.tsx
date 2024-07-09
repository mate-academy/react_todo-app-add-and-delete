import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { deleteTodo } from '../../api/todos';

type TodoItemProps = {
  todo: Todo;
  onCheckTodo: (todoId: number) => void;
  onDeleteTodo: (todoId: number) => void;
  onErrorMessage: (error: string) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onCheckTodo,
  onDeleteTodo,
  onErrorMessage,
}) => {
  const { id, completed, title } = todo;

  const [isTodoDelete, setIsTodoDelete] = useState(false);

  function handleDeleteTodo(todoId: number) {
    setIsTodoDelete(true);

    deleteTodo(todoId)
      .then(() => {
        onDeleteTodo(todoId);
      })
      .catch(() => {
        onErrorMessage('Unable to delete a todo');
      })
      .finally(() => setIsTodoDelete(false));
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          value={title}
          checked={completed}
          onChange={() => onCheckTodo(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isTodoDelete })}
      >
        <div className={cn('modal-background', ' has-background-white-ter')} />
        <div className="loader" />
      </div>
    </div>
  );
};
