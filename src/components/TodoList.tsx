// Оновлений TodoList.tsx з використанням компонента TodoItem

import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodos: number[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, completed: boolean) => void;
}

const modalBackgroundClass = 'modal-background has-background-white-ter';

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  deletingTodos,
  onDelete,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingTodos.includes(todo.id)}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={false}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className={modalBackgroundClass} />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
