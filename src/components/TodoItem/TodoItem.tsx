import React from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  todosIdToDelete: number[]
  onDeleteTodo: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todosIdToDelete,
  onDeleteTodo,
}) => {
  const { title, completed, id } = todo;

  return (
    <div className={classnames('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDeleteTodo(id)}
      >
        ×
      </button>

      <div className={classnames('modal', 'overlay', {
        'is-active': id === 0 || todosIdToDelete.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
