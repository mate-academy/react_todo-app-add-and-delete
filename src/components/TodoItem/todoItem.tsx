import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isLoaded: boolean;
  toggleTodoCompleted: (id: number) => void;
  deleteTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodoCompleted,
  deleteTodo,
  isLoaded,
}) => {
  const handlerToggleTodo = (todoId: number) => toggleTodoCompleted(todoId);
  const handleDeleteTodo = (todoId: number) => deleteTodo(todoId);

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          title="Status"
          type="checkbox"
          checked={todo.completed}
          className="todo__status"
          onChange={() => handlerToggleTodo(todo.id)}
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

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoaded,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
