import React from 'react';
import { Todo } from '../types/Todo';
import { RemoveTodo } from '../utils/removeTodo';
import { useTodosContext } from '../TodoContext';
import classNames from 'classnames';

type Props = {
  todoId: number;
  todo: Todo;
};

const getLoaderClass = (isItemLoading: boolean) =>
  classNames('modal overlay', {
    'is-active': isItemLoading,
  });

export const TodoItem: React.FC<Props> = ({ todoId, todo }) => {
  const { setTodos, loadingItemsIds, setLoadingItemsIds, handleError } =
    useTodosContext();

  const handleDeleteTodo = (deletedId: number) => {
    return RemoveTodo({ deletedId, setTodos, setLoadingItemsIds, handleError });
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
