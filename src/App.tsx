/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo as deleteTodoApi,
} from './api/todos';
import { Todo } from './types/Todo';

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    if (errorTimeout.current) {
      clearTimeout(errorTimeout.current);
    }

    errorTimeout.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, [showError]);

  // Devolve o foco ao campo depois de adicionar uma tarefa.
  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  // Devolve o foco ao campo depois de excluir uma tarefa.
  useEffect(() => {
    if (processingTodos.length === 0) {
      inputRef.current?.focus();
    }
  }, [processingTodos]);

  useEffect(() => {
    return () => {
      if (errorTimeout.current) {
        clearTimeout(errorTimeout.current);
      }
    };
  }, []);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTodo.trim();

    if (!title) {
      showError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(temporaryTodo);

    try {
      const addedTodo = await addTodo(title);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
      setNewTodo('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setProcessingTodos(currentTodos =>
      currentTodos.includes(todoId) ? currentTodos : [...currentTodos, todoId],
    );

    try {
      await deleteTodoApi(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setProcessingTodos(currentTodos =>
        currentTodos.filter(id => id !== todoId),
      );
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id)));
  };

  const handleHideError = () => {
    setErrorMessage('');

    if (errorTimeout.current) {
      clearTimeout(errorTimeout.current);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${
              todos.length > 0 && activeCount === 0 ? 'active' : ''
            }`}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={event => setNewTodo(event.target.value)}
              disabled={isAdding}
              data-cy="NewTodoField"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
                <input
                  id={`todo-${todo.id}`}
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  readOnly
                  data-cy="TodoStatus"
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
                className={`modal overlay ${
                  processingTodos.includes(todo.id) ? 'is-active' : ''
                }`}
              >
                <div className="modal-background" />
                <div className="loader" />
              </div>
            </div>
          ))}

          {tempTodo && (
            <div key={tempTodo.id} data-cy="Todo" className="todo">
              <label className="todo__status-label" htmlFor="todo-temp">
                <input
                  id="todo-temp"
                  type="checkbox"
                  className="todo__status"
                  disabled
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

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
                className={`filter__link ${
                  filter === 'active' ? 'selected' : ''
                }`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${
                  filter === 'completed' ? 'selected' : ''
                }`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedCount === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light ${
          errorMessage ? '' : 'hidden'
        }`}
      >
        <button
          type="button"
          className="delete"
          data-cy="HideErrorButton"
          onClick={handleHideError}
        />

        {errorMessage}
      </div>
    </div>
  );
};
