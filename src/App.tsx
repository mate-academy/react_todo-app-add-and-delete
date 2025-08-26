/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

type FilterType = 'all' | 'active' | 'completed';
type ErrorType = 'LOAD_TODOS' | 'EMPTY_TITLE' | 'ADD_TODO' | 'DELETE_TODO';

const errorMessages: Record<ErrorType, string> = {
  LOAD_TODOS: 'Unable to load todos',
  EMPTY_TITLE: 'Title should not be empty',
  ADD_TODO: 'Unable to add a todo',
  DELETE_TODO: 'Unable to delete a todo',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [errorMessage, setErrorMessage] = useState<ErrorType | ''>('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('LOAD_TODOS'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('EMPTY_TITLE');

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    setIsSubmitting(true);

    client
      .post<Todo>('/todos', {
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      })
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setNewTodoTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('ADD_TODO');
        setTempTodo(null);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (deletingTodoIds.length === 0 && !isSubmitting) {
      inputRef.current?.focus();
    }
  }, [deletingTodoIds, isSubmitting]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = (() => {
    switch (filter) {
      case 'all':
        return todos;
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  })();

  const activeTodos = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed);
  const hasCompleted = completedTodos.length > 0;

  const handleDelete = (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);

    client
      .delete(`/todos/${id}`)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('DELETE_TODO');
      })
      .finally(() => {
        setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
        // не викликаємо useEffect тут
      });
  };

  const handleClearCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setDeletingTodoIds(prev => [...prev, ...completedIds]);

    Promise.allSettled(
      completedIds.map(id => client.delete(`/todos/${id}`).then(() => id)),
    ).then(results => {
      const successfulIds = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      const failedIds = results
        .filter(result => result.status === 'rejected')
        .map((_, index) => completedIds[index]);

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

      if (failedIds.length > 0) {
        setErrorMessage('DELETE_TODO');
      }

      setDeletingTodoIds(prev =>
        prev.filter(todoId => !completedIds.includes(todoId)),
      );
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={submit}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={newTodoTitle}
              ref={inputRef}
              onChange={e => setNewTodoTitle(e.target.value)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isSubmitting}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => {
            const isDeleting = deletingTodoIds.includes(todo.id);

            return (
              <div
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    disabled={isDeleting}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDelete(todo.id)}
                  disabled={isDeleting}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${isDeleting ? 'is-active' : 'hidden'}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}

          {tempTodo && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={false}
                  disabled
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                disabled
              >
                ×
              </button>

              {/* loader для tempTodo */}
              <div
                data-cy="TodoLoader"
                className={`modal overlay ${isSubmitting ? 'is-active' : 'hidden'}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!hasCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage && errorMessages[errorMessage]}
      </div>
    </div>
  );
};
