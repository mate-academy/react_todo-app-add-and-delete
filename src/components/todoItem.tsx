import React, { MouseEvent, RefObject } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isLoaded: boolean;
  toggleTodoCompleted: (id: number) => void;
  isProcessed: boolean;
  handleDelete: (todoId: number) => void;
  waitingDelete: boolean;
  todoWaitDeleteId: number | null;
  inputRef: RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoaded,
  toggleTodoCompleted,
  isProcessed,
  handleDelete,
  waitingDelete,
  todoWaitDeleteId,
  inputRef,
}) => {
  const preventDelete = (
    event: MouseEvent<HTMLButtonElement>,
    todoId: number,
  ) => {
    event.preventDefault();

    handleDelete(todoId);

    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
        'is-active': isLoaded,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          checked={todo.completed}
          className="todo__status"
          onChange={() => toggleTodoCompleted(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={event => preventDelete(event, todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active':
            (isProcessed && todo.id === 0) ||
            (todo.id === todoWaitDeleteId && waitingDelete),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
