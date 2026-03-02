/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  tempTodo: Todo | null;
  updatingIds: number[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  tempTodo,
  updatingIds,
  onToggle,
  onDelete,
}) => {
  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isUpdating={updatingIds.includes(todo.id)}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" htmlFor="temp-todo-status">
            <input
              id="temp-todo-status"
              type="checkbox"
              className="todo__status"
              checked={false}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

export default TodoList;
