import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (id: number) => void;
  onError: (error: string) => void;
  deletingPostsIds: number[];
  onAddDeletingPostId: (id: number | null) => void;
}

export const TodoList: React.FC<Props> = ({
  todos, tempTodo, onDeleteTodo, onError, deletingPostsIds, onAddDeletingPostId,
}) => {
  const handleDeleteTodo = (id: number) => {
    onAddDeletingPostId(id);

    deleteTodos(id)
      .then(() => onDeleteTodo(id))
      .catch(() => {
        onError('Unable to delete a todo');
      })
      .finally(() => onAddDeletingPostId(null));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul className="todolist">
        {todos.map(({ title, completed, id }) => (
          <li
            data-cy="Todo"
            className={cn('todo', { completed })}
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
              className={cn('modal overlay',
                { 'is-active': deletingPostsIds.includes(id) })}
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

            {/* 'is-active' class puts this modal on top of the todo */}
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
