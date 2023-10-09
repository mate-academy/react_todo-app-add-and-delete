import React from 'react';
import cn from 'classnames';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { preparedTodos, tempTodo } = useTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
      {tempTodo && (
        <>
          {tempTodo && (
            <div
              data-cy="Todo"
              className={cn(
                'todo',
                {
                  completed: tempTodo.completed,
                },
              )}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={tempTodo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"

              >
                ×
              </button>
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div
                  className="
                    modal-background
                    has-background-white-ter
                  "
                />
                <div className="loader" />
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};
