import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../api/todos';

type Props = {
  todo: Todo;
  isTempTodo?: boolean;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  processingIds: number[];
  focusInput: () => void | undefined;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setProcessingIds,
  setTodos,
  setErrorMessage,
  processingIds,
  focusInput,
  isTempTodo,
}) => {
  const handleClick = () => {
    setProcessingIds(prev => [...prev, todo.id]);
    deleteTodo(todo.id)
      .then(() =>
        setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id)),
      )
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== todo.id));
        focusInput();
      });
  };

  const handleToggle = () => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    setProcessingIds(prev => [...prev, todo.id]);

    setTodos(currentTodos =>
      currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
    );

    setProcessingIds(prev => prev.filter(id => id !== todo.id));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        active: !todo.completed,
      })}
      key={todo.id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleClick}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processingIds.includes(todo.id) || isTempTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
