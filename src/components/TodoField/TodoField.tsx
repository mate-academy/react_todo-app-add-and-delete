/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  setIsLoadedIDs: (id: number[]) => void;
  isLoadedIDs: number[];
};

export const TodoField: React.FC<Props> = ({
  todo,
  deleteTodo,
  isLoadedIDs,
  setIsLoadedIDs,
}) => {
  const handleDeleteTodo = (todoId: number) => {
    setIsLoadedIDs([todoId, ...isLoadedIDs]);
    deleteTodo(todoId);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
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
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoadedIDs.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
