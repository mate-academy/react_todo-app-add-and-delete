import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/Todo';
import { Loader } from '../Loader';

type Props = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  tempTodo: Todo | null,
  setError: (value: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  tempTodo,
  setError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          setError={setError}
          setTodos={setTodos}
        />
      ))}
      {tempTodo && (
        <div data-cy="Todo" className="todo item-enter-done">
          <Loader
            isActive
          />
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}

        </div>
      )}
    </section>
  );
};
