/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todoList: Todo[];
  tempTodo: Todo | null;
  editTodo: number;
  deleteTodo: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  field: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  field,
  todoList,
  tempTodo,
  editTodo,
  deleteTodo,
  onEdit,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todoList.map(({ id, title, completed }) => (
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: completed })}
        key={id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
          />
        </label>

        {editTodo === id ? (
          <form>
            <input
              ref={field}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onBlur={() => onEdit(0)}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => onEdit(id)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(id)}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': deleteTodo === id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )}
      </div>
    ))}

    {tempTodo && (
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: tempTodo.completed })}
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

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(tempTodo.id)}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
