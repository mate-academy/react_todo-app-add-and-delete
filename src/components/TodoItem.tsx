import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo } from '../api/api';

interface Props {
  todo: Todo,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMessage,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { completed, title, id } = todo;
  const handleCheckboxClick = () => {
    return (completed
      ? updateTodo(todo.id, { completed: false }, setTodos, setErrorMessage)
      : updateTodo(todo.id, { completed: true }, setTodos, setErrorMessage)
    );
  };

  const todoDeleteHandler = async () => {
    setIsLoading(true);

    await deleteTodo(id, setTodos, setErrorMessage);

    setIsLoading(false);
  };

  return (
    <div className={`todo${completed ? ' completed' : ''}`}>
      {!isLoading && (
        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={handleCheckboxClick}
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={todoDeleteHandler}
      >
        ×
      </button>
    </div>
  );
};
