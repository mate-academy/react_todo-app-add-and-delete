import React, { useState } from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
type Props = {
  id: number;
  title: string;
  completed: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<Error>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isInputLoading?: boolean;
  deletingTodoIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  setErrorMessage,
  setTodos,
  isInputLoading = false,
  deletingTodoIds,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  function handleDeleteTodo(todoId: number) {
    setIsLoading(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Error.unableToDelete);
        setTimeout(() => {
          setErrorMessage(Error.none);
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        {' '}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      {/* Remove button appears only on hover */}
      <button
        onClick={() => {
          handleDeleteTodo(id);
        }}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>
      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active':
            isLoading || isInputLoading || deletingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
