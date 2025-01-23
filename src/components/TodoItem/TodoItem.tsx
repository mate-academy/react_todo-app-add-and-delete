/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, FilterEnum } from '../../api/todos';

interface TodoItemProps {
  visibleTodos: Todo[];
  allTodos: Todo[];
  setAllTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loadingTodoId: number;
  setLoadingTodoId: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  selectedFilter: FilterEnum;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  visibleTodos,
  allTodos,
  setAllTodos,
  loadingTodoId,
  setLoadingTodoId,
  loading,
  setLoading,
  setError,
  setErrorMessage,
  selectedFilter,
}) => {
  return (
    <>
      {visibleTodos.map(todo => {
        return (
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed,
            })}
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
              onClick={() => {
                deleteTodo(
                  todo.id,
                  allTodos,
                  setAllTodos,
                  setLoading,
                  setError,
                  setErrorMessage,
                  setLoadingTodoId,
                  selectedFilter,
                );
              }}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being deleted or updated */}
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': loadingTodoId === todo.id && loading,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </>
  );
};
