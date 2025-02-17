import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  handleToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  loadingIds: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  handleToggleTodo,
  onDeleteTodo,
  loadingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleToggleTodo={handleToggleTodo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          loadingIds={loadingIds}
        />
      ))}
      {tempTodo && (
        <div>
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: tempTodo.completed,
            })}
          >
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={tempTodo.completed}
                onChange={() => handleToggleTodo(tempTodo.id)}
              />
            </label>
            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title.trim()}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                onDeleteTodo(tempTodo.id);
              }}
            >
              ×
            </button>
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
