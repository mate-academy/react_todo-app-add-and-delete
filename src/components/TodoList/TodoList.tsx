import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  onUpdate: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onUpdate,
}) => {
  const handleStatusChange = (todoId: number, completed: boolean) => {
    const updatedTodo = todos.find((todo) => todo.id === todoId);

    if (updatedTodo) {
      const updatedTodoWithNewStatus = { ...updatedTodo, completed };

      onUpdate(updatedTodoWithNewStatus);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={cn('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={(e) => handleStatusChange(todo.id, e.target.checked)}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
