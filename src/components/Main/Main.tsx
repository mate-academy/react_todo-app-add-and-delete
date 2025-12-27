import React from 'react';
import classNames from 'classnames';
// eslint-disable-next-line import/extensions
import { Loader } from '../Loader';
import { Todo } from '../../types/Todo';

interface MainProps {
  todos: (Todo & { loading?: boolean })[];
  filteredTodos: (Todo & { loading?: boolean })[];
  toggleTodo: (id: number) => void;
  deleteTodoItem: (id: number) => void;
  loading: boolean;
}

export const Main: React.FC<MainProps> = ({
  filteredTodos,
  toggleTodo,
  deleteTodoItem,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        const checkboxId = `todo-${todo.id}`;

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
          >
            <input
              id={checkboxId}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              disabled={todo.loading}
            />

            {/* Виправлений label з прихованим текстом для доступності */}
            <label className="todo__status-label sr-only" htmlFor={checkboxId}>
              Mark todo as {todo.completed ? 'incomplete' : 'completed'}
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <Loader isActive={!!todo.loading} />

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodoItem(todo.id)}
              disabled={todo.loading}
            >
              ×
            </button>
          </div>
        );
      })}
    </section>
  );
};
