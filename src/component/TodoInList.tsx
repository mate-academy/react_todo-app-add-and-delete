import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  loadingTodosIds: number[],
  setLoadingTodosIds: (ids: number[]) => void,
  deleteTodo: (todoId: number) => Promise<void>,
};

export const TodoInList: React.FC<Props> = React.memo(({
  todo,
  loadingTodosIds,
  setLoadingTodosIds,
  deleteTodo,
}) => {
  function handleDeleteTodo() {
    setLoadingTodosIds([todo.id]);
    deleteTodo(todo.id);
  }

  return (
    <>
      <div className={cn('todo', { completed: todo.completed })}>
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        </label>

        <span
          className="todo__title"
        >
          {todo.title}
        </span>

        <button
          className="todo__remove"
          type="button"
          onClick={handleDeleteTodo}
        >
          x
        </button>

        <div
          className={cn('modal overlay',
            { 'is-active': loadingTodosIds?.includes(todo.id) })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
});
