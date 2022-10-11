import React from 'react';
import cN from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  selectedTodo: number,
  deleteTodoFromServer: (value: number) => void,
};

export const TodoItem: React.FC<Props> = React.memo(
  ({ todo, deleteTodoFromServer, selectedTodo }) => {
    return (
      <div
        data-cy="Todo"
        className={cN(
          'todo',
          { completed: todo.completed },
        )}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={todo.completed}
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
          onClick={() => deleteTodoFromServer(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cN(
            'modal overlay',
            { 'is-active': todo.id === selectedTodo },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
