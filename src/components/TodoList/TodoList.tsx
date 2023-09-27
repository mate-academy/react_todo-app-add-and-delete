import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type TodoListProps = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  onToggleCompleted: (todoId: number, completed: boolean) => void;
  isLoading: boolean;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  onToggleCompleted,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {
                onToggleCompleted(todo.id, !todo.completed);
              }}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            <div>{todo.title}</div>
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </div>
      ))}
      {isLoading && (
        <div className="loader" data-cy="Loader">
          {/* Loading... */}
        </div>
      )}
    </section>
  );
};
