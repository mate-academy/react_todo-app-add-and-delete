import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface TodoListProps {
  preparedTodos: Todo[];
  onDelete: (todoId: number) => void;
  isLoading: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  preparedTodos,
  onDelete,
}) => {
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const handleDelete = (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);
    onDelete(todoId);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
            disabled={loadingTodoIds.includes(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-loading': loadingTodoIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            {loadingTodoIds.includes(todo.id) && <div className="loader" />}
          </div>
        </div>
      ))}
    </section>
  );
};
