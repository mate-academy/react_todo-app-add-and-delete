import classNames from 'classnames';
import React from 'react';

interface Props {
  id: number,
  title: string,
  completed: boolean,
  removeTodo: (id: number) => void;
  isAdding: boolean;
  removedTodos: number[];
  setRemovedTodos: (removedId: number[]) => void;
}

export const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  removeTodo,
  isAdding,
  removedTodos,
  setRemovedTodos,
}) => {
  const remove = (todoId: number) => {
    setRemovedTodos([todoId]);
    removeTodo(todoId);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => remove(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': removedTodos.includes(id) || isAdding },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
