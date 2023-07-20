import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  loadingTodoId: number | null;
  addingTodo: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  loadingTodoId,
  addingTodo,
}) => {
  return (
    <section className="todoapp__main">
      <ul className="todo-list">
        {todos.map(({ completed, title, id }) => (
          <li
            className={classNames('todo', {
              completed,
            })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={completed}
              />
            </label>

            <span className="todo__title">{title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDeleteTodo(id)}
              disabled={loadingTodoId === id}
            >
              ×
            </button>

            {((loadingTodoId === id) || (addingTodo && id === 0)) && (
              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
