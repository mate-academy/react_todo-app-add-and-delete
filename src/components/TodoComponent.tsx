import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  onRemoveTodo: (todoId: number) => Promise<void>,
  deletingTodo: number,
  deletingTodos: number[],
}

export const TodoComponent: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  deletingTodo,
  deletingTodos,
}) => {
  const checkIsActive = (todoId: number) => {
    if (todoId === 0
      || deletingTodo === todoId
      || deletingTodos.find(id => id === todoId)) {
      return true;
    }

    return false;
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onRemoveTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': checkIsActive(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
