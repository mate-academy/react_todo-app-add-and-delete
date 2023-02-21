import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoInfoPropsType {
  todo: Todo,
  handleDeleteTodo: (todoId: number) => void,
}

export const TodoInfo: React.FC<TodoInfoPropsType> = ({
  todo,
  handleDeleteTodo,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteTodoOnClick = () => {
    handleDeleteTodo(todo.id);
    setIsLoading(true);
  };

  return (
    <div className={classNames(
      'todo',
      { completed: todo.completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>
      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteTodoOnClick}
      >
        ×
      </button>
      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader is-loading" />
      </div>
    </div>
  );
};
