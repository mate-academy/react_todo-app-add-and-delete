import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  loading: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDeleteTodo,
  loading,
}) => {
  console.log(loading);

  return (
    <section className="todoapp__main">
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            className={classNames('todo', {
              completed: todo.completed,
            })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
              />
            </label>

            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDeleteTodo(todo.id)}
              disabled={loading}
            >
              ×
            </button>

            {loading && (
              <div className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}

            {/* <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div> */}
          </li>
        ))}
      </ul>
    </section>
  );
};
