import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  handleDelete: (id: number) => void;
  isDeleting: boolean;
}

export const TodoList: FC<Props> = ({ todos, handleDelete, isDeleting }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <div
          className={cn('todo',
            { completed: todo.completed })}
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
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>

          <div className={cn('modal overlay',
            { 'is-active': isDeleting })}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
