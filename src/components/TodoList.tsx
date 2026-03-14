/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React, { useState } from 'react';
import { deleteTodo } from '../api/todos';
import EError from '../utils/EError';

interface ITodoList {
  todos: Todo[] | undefined;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (error: EError) => void;
}

export const TodoList: React.FC<ITodoList> = ({
  todos,
  setTodos,
  setErrorMessage,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletindTodoId, setDeletindTodoId] = useState<number>();

  const handleDelete = async (todoId: number) => {
    try {
      setIsDeleting(true);
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(EError.delete);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {todos?.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
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

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isDeleting}
            onClick={() => {
              setDeletindTodoId(todo.id);
              handleDelete(todo.id);
            }}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': isDeleting && deletindTodoId === todo.id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </>
  );
};
