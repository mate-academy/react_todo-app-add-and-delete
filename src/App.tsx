import React, { useEffect, useRef, useState } from 'react';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { USER_ID, getTodos, postTodo } from './api/todos';
import { UserWarning } from './UserWarning';
import { useTodosContext } from './context/TodoContext';
import { ErrorList } from './types/ErrorList';

export const App: React.FC = () => {
  const { todos, setTodos, errorMessage, handleError, setTempTodo } =
    useTodosContext();

  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorList.LoadTodos);
      });
  }, []);

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleQuerySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim().length <= 0) {
      handleError(ErrorList.EmptyTitle);

      return;
    }

    setIsLoading(true);

    const newItem = {
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    setTempTodo({ ...newItem, id: 0 });

    postTodo({ ...newItem })
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setQuery('');
        focusInput();
      })
      .catch(() => {
        handleError(ErrorList.AddTodo);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        focusInput();
      });
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const completedTodosCount = todos.filter(todo => !todo.completed).length;

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

          <form onSubmit={handleQuerySubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleQueryChange}
              disabled={isLoading}
            />
          </form>
        </header>

        <TodoList focusInput={focusInput} />

        {todos.length > 0 && (
          <Footer
            completedTodosCount={completedTodosCount}
            focusInput={focusInput}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
