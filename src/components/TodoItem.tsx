import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { GlobalContex } from '../TodoContext';
import { Todo } from '../types/Todo';
import { TodoErrors } from '../types/TodoErrors';

type TodoItemProps = {
  todo: Todo | Omit<Todo, 'userId'>;
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const {
    todos,
    setTodos,
    setError,
    deleteTodoItem,
    isLoading,
  } = useContext(GlobalContex);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleTodoStatusChange = () => { };

  const handleDeleteTodoClick = (todoId: number) => {
    setIsDeleting(true);

    deleteTodoItem(todoId)
      .then(() => {
        setTodos(todos.filter(todoItem => todoItem.id !== todoId));
      })
      .catch(() => setError(TodoErrors.Delete))
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoStatusChange}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodoClick(id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': (isLoading && !id) || (isDeleting && id),
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
