import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';
import { EditingForm } from './EditingForm';
import { removeTodo } from '../api/todos';
import { TodosContext } from '../context/TodosContext';
import { ErrorType } from '../types/ErrorType';

type Props = {
  todo: Todo
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    todos, setTodos, setError, USER_ID,
  } = useContext(TodosContext);

  const { title, completed } = todo;
  const [isEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTodoDelete = () => {
    setIsLoading(true);

    removeTodo(USER_ID, todo.id)
      .then(() => {
        setTodos(todos.filter(t => t.id !== todo.id));
      })
      .catch(() => {
        setError(ErrorType.Delete);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        [TodoStatus.Editing]: isEditing,
        [TodoStatus.Completed]: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {isEditing
        ? <EditingForm />
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleTodoDelete}
            >
              ×
            </button>

          </>
        )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
