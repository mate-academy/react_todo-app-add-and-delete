import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoContentMainProps {
  todos: Todo[],
}

export const TodoContentMain: FC<TodoContentMainProps> = ({ todos }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          key={todo.id}
          className={classNames(
            'todo',
            {
              completed: todo.completed,
            },
          )}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove">×</button>

          {/* overlay will cover the todo while it is being updated */}
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
