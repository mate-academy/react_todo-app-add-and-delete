import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onError: (error: string) => void;
  onDeleteTodo: (id: number) => void;
  deletingPostsIds: number[];
  onAddDeletingPostsIds: (id: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onError,
  onDeleteTodo,
  deletingPostsIds,
  onAddDeletingPostsIds,
}) => {
  const handleDeleteTodo = (id: number) => {
    onAddDeletingPostsIds(id);
    onError('');

    deleteTodos(id)
      .then(() => onDeleteTodo(id))
      .catch(() => {
        onError('Unable to delete a todo');
      })
      .finally(() => onAddDeletingPostsIds(null));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul className="todolist">
        {todos.map(({ id, title, completed }) => (
          <li
            key={id}
            data-cy="Todo"
            className={classNames('todo', { completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
            <div
              data-cy="TodoLoader"
              className={classNames(
                'modal overlay',
                { 'is-active': deletingPostsIds.includes(id) },
              )}
            >
              <div
                className="modal-background has-background-white-ter"
              />
              <div className="loader" />
            </div>
          </li>
        ))}
        {tempTodo && (
          <li data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </li>
        )}
      </ul>
    </section>
  );
};
