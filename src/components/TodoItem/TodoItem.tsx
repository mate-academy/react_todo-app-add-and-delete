import React, { memo, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onTodoDelete: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = memo(({ todo, onTodoDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(0);

  const deleteTodo = async (todoId: number) => {
    setSelectedTodoId(todoId);
    setIsLoading(true);

    await onTodoDelete(todoId);

    setIsLoading(false);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': isLoading && todo.id === selectedTodoId })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
