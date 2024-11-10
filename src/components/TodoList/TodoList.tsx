/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onToggleTodo: (id: number) => void;
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onToggleTodo,
  onDelete,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {/* Отображение tempTodo перед основным списком todos, если tempTodo существует */}
      {tempTodo && (
        <li data-cy="TempTodo" className="todo temp-todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" disabled />
          </label>
          <span className="todo__title">{tempTodo.title}</span>
          <div className="loader" />{' '}
          {/* Индикатор загрузки для временной задачи */}
        </li>
      )}

      {/* Основной список todos */}
      {todos.map(todo => (
        <li
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => onToggleTodo(todo.id)}
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
        </li>
      ))}
    </ul>
  );
};
