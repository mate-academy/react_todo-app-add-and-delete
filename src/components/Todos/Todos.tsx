import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  creatingTodo: Todo | null;
  isDeleting: (id: number) => boolean;
  onCompletedMarkClik: (id: number) => void;
  onEditClik: (id: number) => void;
  onDeleteClik: (id: number) => void;
};

export const Todos: React.FC<Props> = ({
  todos,
  creatingTodo,
  isDeleting,
  onCompletedMarkClik,
  onDeleteClik,
  onEditClik,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ id, completed, title }) => {
        return (
          <div
            data-cy="Todo"
            className={cn('todo', { completed: completed })}
            key={id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
                onChange={() => onCompletedMarkClik(id)}
              />{' '}
            </label>

            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                onEditClik(id);
              }}
            >
              {title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDeleteClik(id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={cn('modal', 'overlay', {
                'is-active': isDeleting(id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {/* This todo is being edited */}
      {/* <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
          s
        </label>

        * This form is shown instead of the title and remove button *
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}

      {/* This todo is in loadind state */}
      {creatingTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />{' '}
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {creatingTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
          {/* * 'is-active' class puts this modal on top of the todo * */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
