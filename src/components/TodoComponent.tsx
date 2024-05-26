/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { useState } from 'react';
import { useTodosMethods } from '../context/Store';

interface Props {
  todo: Todo;
  isTemp?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoComponent: React.FC<Props> = ({
  todo,
  isTemp = false,
  inputRef,
}) => {
  const { deleteTodoLocal, setTimeoutErrorMessage } = useTodosMethods();

  const [loading, setLoading] = useState(false);

  const onDelete = (todoId: number) => {
    setLoading(true);

    // tries to delete on server, if success - removes locally
    deleteTodo(todoId)
      .then(() => {
        deleteTodoLocal(todo.id);
      })
      .catch(() => {
        setTimeoutErrorMessage('Unable to delete a todo');
      });

    // focuses on input field
    inputRef.current?.focus();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(isTemp || loading) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
