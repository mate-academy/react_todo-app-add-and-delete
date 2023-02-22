import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  handleDeleteTodo?: (id: number) => void,
  loadingTodoIds: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo = () => { },
  loadingTodoIds,
}) => {
  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={(event) => {
          event.preventDefault();
          handleDeleteTodo(todo.id);
        }}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        { 'is-active': loadingTodoIds.includes(todo.id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
