/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { getFilteredTodos } from '../components/filteredTodos';
import { Todo } from '../types/Todo';
import { FilterTypes } from '../types/filterTypes';
import classNames from 'classnames';

interface TodoListProps {
  todos: Todo[];
  filter: FilterTypes;
  deleteTodo: (todoId: number) => void;
  fakeTodo: Todo | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  deleteTodo,
  fakeTodo,
}) => {
  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => todo.id !== undefined && deleteTodo(todo.id)}
          >
            ×
          </button>
        </div>
      ))}
      {fakeTodo && (
        <>
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
          <div
            key={fakeTodo.id}
            data-cy="Todo"
            className={classNames('todo', { completed: fakeTodo.completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={fakeTodo.completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {fakeTodo.title}
            </span>
          </div>
        </>
      )}
    </section>
  );
};
