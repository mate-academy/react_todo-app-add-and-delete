import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
  todo: Todo;
  handleDeleteTodo: (value: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  todos,
  setTodos,
}) => {
  const { id, completed, title } = todo;
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleCompletedTodo = (todoID: number) => {
    const newTodo = todos.map(el => (
      el.id === todoID
        ? { ...el, completed: !el.completed }
        : el
    ));

    setTodos(newTodo);

    setIsCompleted((complete) => !complete);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: isCompleted,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompletedTodo(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
