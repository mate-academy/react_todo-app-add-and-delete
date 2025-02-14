/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Footer } from './components/Footer';
import FilterStatus from './enums/FilterStatus';

const USER_ID = 2338;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const loadTodos = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setShowError(false);
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch (error) {
      setErrorMessage('Unable to load todos');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
    if (inputRef.current) {
      inputRef.current.focus();
    }

    return () => {
      setErrorMessage('');
    };
  }, []);

  useEffect(() => {
    if (!isAddingTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingTodo]);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);

      return;
    }

    setIsAddingTodo(true);
    setErrorMessage('');
    setShowError(false);

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo(temp);

    try {
      const newTodo = await createTodo(newTodoTitle);

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setNewTodoTitle('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setShowError(true);
      // Set a timeout to hide the error message after 3 seconds
      setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsAddingTodo(false);
      setTempTodo(null);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setDeletingTodoId(id);
    setErrorMessage('');
    setShowError(false);
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setDeletingTodoId(null);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setErrorMessage('');
    setShowError(false);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        .catch(() => ({ id: todo.id, success: false })),
    );

    const results = await Promise.all(deletePromises);

    const failedDeletions = results.filter(result => !result.success);
    const successfulDeletions = results.filter(result => result.success);

    if (failedDeletions.length > 0) {
      setErrorMessage('Unable to delete a todo');
      setShowError(true);
      // Don't hide the error message automatically
    }

    setTodos(prevTodos =>
      prevTodos.filter(
        todo => !successfulDeletions.some(result => result.id === todo.id),
      ),
    );

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    setShowError(true);

    return <UserWarning />;
  }

  const hideError = () => {
    setErrorMessage('');
    setShowError(false);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
            />
          )}
          <form onSubmit={handleCreateTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isAddingTodo}
              ref={inputRef} // Assign the ref to the input field
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <TodoList
                todos={filteredTodos}
                onDelete={handleDeleteTodo}
                deletingTodoId={deletingTodoId}
              />
              {tempTodo && (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input type="checkbox" className="todo__status" />
                  </label>
                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>
                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </>
          )}
        </section>
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onClearCompleted={handleClearCompleted}
            className="todoapp__footer"
            data-cy="Footer"
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !showError,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
