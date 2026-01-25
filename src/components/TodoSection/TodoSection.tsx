/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[];
  handleToggle: (todo: Todo) => void;
  editingTodoId: number | null;
  handleEditStart: (todo: Todo) => void;
  deletTodo: (todoId: number) => void;
  handleRenameSubmit: (
    event: React.FormEvent | React.FocusEvent,
    todo: Todo,
  ) => void;
  query: string;
  onQueryChange: (value: string) => void;
  onEditingTodoId: (value: number | null) => void;
  loadingTodoIds: number[];
};

export const TodoSection: React.FC<Props> = ({
  visibleTodos,
  handleToggle,
  editingTodoId,
  handleEditStart,
  deletTodo,
  handleRenameSubmit,
  query,
  onQueryChange,
  onEditingTodoId,
  loadingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos?.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              id={`todo-status-${todo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
            />
          </label>

          {editingTodoId !== todo.id ? (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleEditStart(todo)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deletTodo(todo.id)}
              >
                ×
              </button>
            </>
          ) : (
            <form onSubmit={e => handleRenameSubmit(e, todo)}>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={query}
                autoFocus
                onChange={e => onQueryChange(e.target.value)}
                onBlur={e => handleRenameSubmit(e, todo)}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    onEditingTodoId(null);
                    onQueryChange(todo.title);
                  }
                }}
              />
            </form>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': todo.id === 0 || loadingTodoIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
