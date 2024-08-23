/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { Todo } from '../../types';
import classNames from 'classnames';

import TodosContext from '../../contexts/Todos/TodosContext';

type Props = {
  todo: Todo;
  isPending?: boolean;
};

export const TodoCard = ({ todo, isPending = false }: Props) => {
  const { deleteTodo, updateTodo } = TodosContext.useContract();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDeleteTodo = async () => {
    setIsUpdating(true);

    await deleteTodo(todo.id);

    setIsUpdating(false);
  };

  const handleUpdateTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get('title') as string;

    setIsEditing(false);
    setIsUpdating(true);

    if (!title) {
      await deleteTodo(todo.id);
    } else {
      await updateTodo(todo.id, { title });
    }

    setIsUpdating(false);
  };

  const handleToggleComplete = async () => {
    setIsUpdating(true);

    await updateTodo(todo.id, { completed: !todo.completed });

    setIsUpdating(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          onClick={handleToggleComplete}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdateTodo}>
          <input
            name="title"
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}

          <button
            onClick={handleDeleteTodo}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isUpdating || isPending,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
