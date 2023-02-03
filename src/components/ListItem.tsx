import React from 'react';
import classnames from 'classnames';
import { Todo } from '../types/Todo';
import { removeTodo } from '../api/todos';

type Props = {
  todo: Todo,
  deleteItem: (todoId: number) => void,
};

export const ListItem: React.FC<Props> = ({ todo, deleteItem }) => {
  return (
    <div
      data-cy="Todo"
      className={classnames({
        todo: true,
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          removeTodo(todo.id).then(() => {
            deleteItem(todo.id);
          });
        }}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
