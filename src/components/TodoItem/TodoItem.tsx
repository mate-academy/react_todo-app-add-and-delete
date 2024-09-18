/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { errorMessages, ErrorMessages } from '../../types/ErrorMessages';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  onHandleDeleteTodo?: (deleteTodoIds: number[]) => void;
  onSetError: (errorMessage: ErrorMessages) => void;
  isSubmiting?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onHandleDeleteTodo,
  onSetError,
  isSubmiting,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleTodoChecked = () => {};

  const handleDeleteTodo = (todoId: number) => {
    setIsDeleting(true);

    deleteTodo(todoId)
      .then(() => {
        if (onHandleDeleteTodo) {
          onHandleDeleteTodo([todoId]);
        }
      })
      .catch(() => onSetError(errorMessages.delete))
      .finally(() => setIsDeleting(false));
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleTodoChecked}
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
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isDeleting || isSubmiting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
