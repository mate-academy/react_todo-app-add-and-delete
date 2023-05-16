import React, { useState } from 'react';
import CN from 'classnames';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  setTodos: (todos: Todo[]) => void;
  setError: (error: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setError,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);

    deleteTodo(todo.id)
      .then(() => {
        return setTodos((prevTodos: Todo[]) => {
          return prevTodos.filter((curTodo) => curTodo.id !== todo.id);
        });
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <div className={CN('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={handleDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={CN('modal', 'overlay', {
        active: isDeleting,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
