/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorStatusType';
import { deleteTodo } from '../../api/todos';

type TodoItemProps = {
  todo: Todo;
  todos?: Todo[] | null;
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  isTempTodo: boolean;
  setErrorMessage?: (errorMessage: ErrorMessage) => void;
  todoIdsToDelete?: number[];
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  todos,
  isTempTodo,
  setTodos,
  setErrorMessage,
  todoIdsToDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (todoIdsToDelete && todoIdsToDelete.includes(todo.id)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [todoIdsToDelete, todo.id]);

  const handleOnClickDelete = () => {
    setIsLoading(true);
    deleteTodo(todo.id)
      .then(() => {
        if (todos && setTodos) {
          setTodos(currentTodos =>
            currentTodos.filter(todoItem => todoItem.id !== todo.id),
          );
        }
      })
      .catch(() => {
        if (setErrorMessage) {
          setErrorMessage(ErrorMessage.DeleteTodo);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
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
        onClick={handleOnClickDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || isTempTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
