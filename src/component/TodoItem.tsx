/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodo: (id: number) => void;
  isLoadingTodo: number[];
  handleUpdateTodo: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = React.memo(
  ({ todo, handleDeleteTodo, isLoadingTodo, handleUpdateTodo }) => {
    const onChange = () => {
      handleUpdateTodo({
        id: todo.id,
        title: todo.title,
        userId: todo.userId,
        completed: !todo.completed,
      });
    };

    return (
      <div
        data-cy="Todo"
        key={todo.id}
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={onChange}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        {/* <form>
             <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form> */}

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
        >
          ×
        </button>
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isLoadingTodo.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
