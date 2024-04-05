import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDeleteTodo?: (todoId: number) => void;
  deletedTodoIds?: number[];
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deletedTodoIds = [],
  onDeleteTodo = () => {},
}) => {
  const isIncludesId = deletedTodoIds.includes(todo.id);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label aria-label="todo-status" className="todo__status-label">
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
        onClick={() => onDeleteTodo(todo.id)}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isIncludesId || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
