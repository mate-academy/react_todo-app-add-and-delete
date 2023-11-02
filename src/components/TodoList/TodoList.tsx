import React from 'react';
import classNames from 'classnames';
// import { TodoItem } from "../TodoItem/TodoItem";
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onDelete?: (id: number) => void,
};

export const TodoList: React.FC<Props> = React.memo((({
  todos,
  // selectedPostId,
  onDelete = () => {},
  // onSelect = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        // <TodoItem
        //   key={todo.id}
        //   todo={todo}
        // />
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed === true })}
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

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
}));
