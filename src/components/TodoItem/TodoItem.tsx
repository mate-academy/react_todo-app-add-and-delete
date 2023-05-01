import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  loadingId: number[],
  onRemove: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    loadingId,
    onRemove,
  }) => {
    const isLoading = (todoId: number) => {
      return loadingId.some(item => item === todoId);
    };

    const handlerOnClick = () => onRemove(todo.id);

    return (
      <div
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            defaultChecked={todo.completed}
          />
        </label>

        <span className="todo__title">{todo.title}</span>
        <button
          type="button"
          className="todo__remove"
          onClick={handlerOnClick}
        >
          ×
        </button>

        <div
          className="modal overlay"
          style={{
            display: isLoading(todo.id)
              ? 'flex' : 'none',
          }}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
