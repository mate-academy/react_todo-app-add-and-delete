import classNames from 'classnames';
import { deleteSelectedTodo, getTodos, updateTodo } from '../api/todos';
import { Errors } from '../types/Errors';
import { Todo } from '../types/Todo';
import React, { useState } from 'react';

interface Props {
  todos: Todo[];
  completedTodos: Todo[];
  loadingTodo: Todo | null;
  anyLoading: boolean;
  isAllcompleted: boolean;
  clearCompleteLoading: Todo[];
  setTodos: (todos: Todo[]) => void;
  deleteTodo: (todo: Todo) => void;
  setErrorMessage: (errorMessage: Errors | '') => void;
  resetError: () => void;
  setLoadingTodo: (todo: Todo | null) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  completedTodos,
  loadingTodo,
  anyLoading,
  clearCompleteLoading,
  isAllcompleted,
  setTodos,
  deleteTodo,
  setErrorMessage,
  resetError,
  setLoadingTodo,
}) => {
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [updatingValue, setUpdatingValue] = useState<string>('');

  function handleCompleteTodo(todo: Todo) {
    setLoadingTodo(todo);

    const todoWithUpdatedCompletion = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodo(todoWithUpdatedCompletion)
      .then(() => {
        return getTodos();
      })
      .then(setTodos)
      .then(() => setUpdatingTodoId(null))
      .catch(() => {
        setErrorMessage(Errors.notUpdate);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setLoadingTodo(null));
  }

  function handleUpdateValue(event: React.ChangeEvent<HTMLInputElement>) {
    setUpdatingValue(event.target.value);
  }

  function handleDeleteTodo(todo: Todo) {
    setLoadingTodo(todo);

    deleteSelectedTodo(todo)
      .then(() => deleteTodo(todo))
      .catch(() => {
        setErrorMessage(Errors.notDelete);
        setTimeout(resetError, 3000);
      })
      .finally(() => setLoadingTodo(null));
  }

  function handleUpdateSubmit(event: React.FormEvent, todo: Todo) {
    event.preventDefault();

    if (updatingValue.trim() === todo.title.trim()) {
      setUpdatingTodoId(null);
      return;
    }

    if (updatingValue.trim() === '') {
      handleDeleteTodo(todo);

      return;
    }

    setLoadingTodo(todo);

    const updatedTodo = {
      id: todo.id,
      completed: todo.completed,
      userId: todo.userId,
      title: updatingValue,
    };

    updateTodo(updatedTodo)
      .then(() => getTodos())
      .then(setTodos)
      .then(() => setUpdatingTodoId(null))
      .catch(() => {
        setErrorMessage(Errors.notUpdate);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setLoadingTodo(null));
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const form = event.target.form;

    if (form) {
      form.requestSubmit();
    }
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setUpdatingTodoId(null);
    }
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', {
            completed: completedTodos.includes(todo),
          })}
          onDoubleClick={() => {
            setUpdatingTodoId(todo.id || null);
            setUpdatingValue(todo.title);
          }}
        >
          {/* eslint-disable jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onClick={() => handleCompleteTodo(todo)}
              checked={
                completedTodos.find(thisArrTodo => thisArrTodo.id === todo.id)
                  ?.completed
              }
            />
          </label>

          {todo.id === updatingTodoId ? (
            <form onSubmit={event => handleUpdateSubmit(event, todo)}>
              <input
                autoFocus
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                onBlur={handleBlur}
                onChange={handleUpdateValue}
                onKeyUp={handleKeyUp}
                value={updatingValue}
              />
            </form>
          ) : (
            <>
              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo)}
              >
                ×
              </button>
            </>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active':
                loadingTodo?.id === todo.id ||
                (anyLoading && !todo.completed) ||
                (anyLoading && isAllcompleted) ||
                clearCompleteLoading.includes(todo),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
