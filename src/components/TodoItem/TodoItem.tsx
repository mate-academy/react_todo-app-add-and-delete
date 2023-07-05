import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo,
  loadingTodosId: number[],
  handleDeleteTodo: (todoId: number) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loadingTodosId,
  handleDeleteTodo,
}) => {
  return (
    <div
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
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
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': loadingTodosId
            .filter(todoId => todo.id === todoId).length,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
