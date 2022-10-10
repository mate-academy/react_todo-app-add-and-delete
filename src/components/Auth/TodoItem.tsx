import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (param: number) => void,
  isAdding: boolean,
  handleChange: (updateId: Todo) => Promise<void>,
  selectedId: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  isAdding,
  handleChange,
  selectedId,
}) => {
  const isLoading = isAdding && todo?.id === 0;

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          onChange={() => handleChange(todo)}
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>
      { selectedId.includes(todo.id) && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader is-loading " />
        </div>
      )}

      { isLoading && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader is-loading " />
        </div>
      )}
    </div>
  );
};
