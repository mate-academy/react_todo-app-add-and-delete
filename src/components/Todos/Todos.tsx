import cn from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  onDeleteTodo: (id: number) => void,
  updatingTodos: number[],
};

export const Todos: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  updatingTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(({
        id,
        title,
        completed,
      }) => (
        <div
          className={cn('todo', { completed })}
          key={id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              defaultChecked={completed}
            />
          </label>

          <span className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>

          <div className={cn(
            'modal overlay',
            { 'is-active': updatingTodos.includes(id) },
          )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>

        </div>
      ))}

      {/* This todo is being edited */}
      {/* <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label> */}

      {/* This form is shown instead of the title and remove button */}
      {/* <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
    </section>
  );
};
