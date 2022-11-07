import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  isAdding: boolean;
  query: string;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isAdding,
  query,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          deleteTodo={deleteTodo}
          key={todo.id}
        />
      ))}

      {isAdding && (
        <div
          data-cy="Todo"
          className="todo"
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {query}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
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
