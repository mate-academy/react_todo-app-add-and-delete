/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import './TodoList.scss';

type Props = {
  todos: Todo[];
  toggleComplete: (todo: Todo) => void;
  onDelete: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = React.memo(function TodoList({
  todos,
  toggleComplete,
  onDelete,
  tempTodo,
}) {
  const [deletingTodosId, setDeletingTodosId] = useState<number[]>([]);

  function handleDelete(todoId: number) {
    setDeletingTodosId(prevList => [...prevList, todoId]);
    onDelete(todoId).finally(() =>
      setDeletingTodosId(prevList => {
        const newList = [...prevList];

        newList.splice(prevList.indexOf(todoId), 1);

        return newList;
      }),
    );
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {
                toggleComplete(todo);
              }}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': deletingTodosId.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo !== null && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
});
