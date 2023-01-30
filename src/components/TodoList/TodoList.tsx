import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[]
  processings: number[]
  onRemove: (id: number) => void
}

export const TodoList: React.FC<Props> = React.memo((
  {
    todos,
    processings,
    onRemove,
  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {
        todos.map(todo => (
          <div
            key={todo.id}
            data-cy="Todo"
            className={
              cn('todo', { completed: todo.completed })
            }
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

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onRemove(todo.id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={
                cn(
                  'modal overlay',
                  { 'is-active': processings.includes(todo.id) },
                )
              }
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))
      }
    </section>
  );
});
