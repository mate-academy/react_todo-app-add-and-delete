import React from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  selectedTodos: number[],
  onDelete: CallableFunction,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodos,
  onDelete,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classnames(
        'todo',
        { completed: todo.completed },
      )}
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
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={
          classnames(
            'modal',
            'overlay',
            { 'is-active': selectedTodos.includes(todo.id) || todo.id === 0 },
          )
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
