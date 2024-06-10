/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Array<{ id: number; title: string; completed: boolean }>;
  handleTodoStatusChange: (id: number) => void;
  handleDeleteTodo: (id: number) => void;
  loadingTodoId: number | null;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  handleTodoStatusChange,
  handleDeleteTodo,
  loadingTodoId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleTodoStatusChange={handleTodoStatusChange}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodoId={loadingTodoId === todo.id}
          tempTodo={tempTodo}
        />
      ))}

      {tempTodo && (
        <div
          key={tempTodo.id}
          data-cy="Todo"
          className={`todo ${tempTodo.completed ? 'completed' : ''}`}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              onChange={() => handleTodoStatusChange(tempTodo.id)}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(tempTodo.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
