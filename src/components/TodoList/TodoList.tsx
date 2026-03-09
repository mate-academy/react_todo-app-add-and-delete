/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
// import { deleteTodos } from '../../api/todos';
// import { useState } from 'react';
type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processings: number[];
  onDeleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processings,
  onDeleteTodo,
}) => {
  return (
    <section
      className={cn('todoapp__main', {
        hidden: todos?.length === 0 && !tempTodo,
      })}
      data-cy="TodoList"
    >
      {todos?.map(todo => (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
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

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': processings.includes(todo.id), // ← лоадер тільки для todo що видаляється
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo" key={0}>
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={false}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
