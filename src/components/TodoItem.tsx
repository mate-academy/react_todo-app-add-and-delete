import React from 'react';
import { Todo } from '../types/Todo';
import { removeTodo } from '../utils/removeTodo';
import classNames from 'classnames';

type Props = {
  key: number;
  todoId: number;
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
  todo: Todo;
  onErrorMessage: (errMessage: string) => void;
  loadingItemsIds: number[];
  onLoadingItemsIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const getLoaderClass = (isItemLoading: boolean) =>
  classNames('modal overlay', {
    'is-active': isItemLoading,
  });

export const TodoItem: React.FC<Props> = ({
  onTodos,
  todo,
  todoId,
  onErrorMessage,
  loadingItemsIds,
  onLoadingItemsIds,
}) => {
  const handleDeleteTodo = (deletedId: number) => {
    return removeTodo({
      deletedId,
      onTodos,
      onErrorMessage,
      onLoadingItemsIds,
    });
  };

  const isItemLoading = loadingItemsIds.includes(todoId);

  return (
    <div
      key={todoId}
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
          checked={todo.completed}
          aria-label="todo-status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todoId)}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className={getLoaderClass(isItemLoading)}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
