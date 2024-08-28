/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState } from 'react';
/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  handleDeleteTodo: (id: number) => void;
  completedTodos: Todo[];
};

export const TodoMain: React.FC<Props> = ({
  todos,
  isLoading,
  tempTodo,
  handleDeleteTodo,
  completedTodos,
}) => {
  const [selectedTodo, setSelectedTodo] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', todo.completed && 'completed')}
          key={todo.id}
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
            onClick={() => {
              handleDeleteTodo(todo.id);
              setSelectedTodo(todo.id);
            }}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active':
                (selectedTodo === todo.id && isLoading) ||
                (isLoading && completedTodos.includes(todo)),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', tempTodo.completed && 'completed')}
          key={tempTodo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': isLoading && tempTodo,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
