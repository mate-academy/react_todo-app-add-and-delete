/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { FC } from 'react';
import { Todo } from '../types/Todo';
import React from 'react';

type Props = {
  todo: Todo;
  loading: boolean;
  handleCompletedTodo: (todo: Todo) => void;
  showUpdateInput: boolean;
  deleteTodo: (id: number) => void;
  updateTodo: (todo: Todo) => void;
};
export const TodoItem: FC<Props> = ({
  todo,
  loading,
  handleCompletedTodo,
  showUpdateInput,
  deleteTodo,
  updateTodo,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCompletedTodo(todo)}
        />
      </label>

      {!showUpdateInput ? (
        <>
          <div
            data-cy="TodoLoader"
            className={`modal overlay ${loading && 'is-active'} `}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>

          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => updateTodo(todo)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <>
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        </>
      )}
    </div>
  );
};
