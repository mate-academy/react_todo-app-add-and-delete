import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onRemove: (todoId: number) => void;
  deletedTodoId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onRemove,
  deletedTodoId,
}) => (
  <section
    className="todoapp__main"
    data-cy="TodoList"
  >
    {todos.map(todo => (
      <div
        data-cy="Todo"
        className="todo"
        key={todo.id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span
          data-cy="TodoTitle"
          className="todo__title"
        >
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
          className={classNames(
            'modal',
            'overlay',
            { 'is-active': deletedTodoId.includes(todo.id) },
          )}
        >
          <div
            className="modal-background has-background-white-ter"
          />
          <div className="loader" />
        </div>
      </div>
    ))}

  </section>
);
