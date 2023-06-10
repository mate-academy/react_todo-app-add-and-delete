import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoListProps {
  todos: Todo[];
  onChange: (isChecked: boolean, id: number) => void;
  onRemove: (id: number, completed: boolean) => void;
  tempTodo: null | Todo;
  updatingIds: number[];
}

export const TodoList: React.FC<TodoListProps> = (
  {
    todos,
    onChange,
    onRemove,
    tempTodo,
    updatingIds,
  },
) => (
  <section className="todoapp__main">
    {todos.map(todo => {
      const {
        id,
        title,
        completed,
      } = todo;

      const isUpdating = updatingIds.includes(id);

      return (
        <div
          className={
            classNames(
              'todo',
              { completed },
            )
          }
          key={id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={(event) => onChange(event.target.checked, id)}
            />
          </label>

          <span className="todo__title">{title}</span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onRemove(id, completed)}
          >
            ×
          </button>

          <div className={
            classNames(
              'modal',
              'overlay',
              { 'is-active': isUpdating },
            )
          }
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      );
    })}
    {tempTodo && (
      <div className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            disabled
          />
        </label>

        <span className="todo__title">{tempTodo.title}</span>

        <button
          type="button"
          className="todo__remove"
          disabled
        >
          ×
        </button>

        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
