import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

interface Props {
  todo: Todo;
  removeTodo: (todoId: number) => Promise<void>;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTodo = async () => {
    setIsDeleting(true);

    await removeTodo(todo.id);

    setIsDeleting(false);
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <TodoLoader isLoading={isDeleting} />
    </div>
  );
};
