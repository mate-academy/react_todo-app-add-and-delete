import React, { useContext, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { GlobalContext } from '../../providers';
import { deleteTodo } from '../../api/todos';
import { Error } from '../../types/Error';

interface Props {
  todo: Todo,
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    isLoading,
    todos,
    setTodos,
    setError,
  } = useContext(GlobalContext);

  const [isDeleting, setIsDeleting] = useState(false);

  const isTempTodo = todo.id === 0;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTodo(todo.id);
      setTodos((prev) => prev.filter((el) => el.id !== todo.id));
    } catch (e) {
      setError(Error.Delete);
      setTodos(todos);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isTempTodo
              || isLoading
              || isDeleting,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
