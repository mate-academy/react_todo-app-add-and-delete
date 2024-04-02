import React, { useEffect, useMemo, useRef, useState } from 'react';
import { wait } from './utils/fetchClient';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { USER_ID, getTodos, postTodo } from './api/todos';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>(Status.All);
  const [query, setQuery] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleError = (message: string) => {
    setErrorMessage(message);

    return wait(3000).then(() => setErrorMessage(''));
  };

  useEffect(() => {
    inputRef.current?.focus();
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError('Unable to load todos');
      });
  }, []);

  const preparedTodos = useMemo(() => {
    switch (status) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [status, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleQuerySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim().length <= 0) {
      handleError('Title should not be empty');

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
        handleError('Unable to add a todo');
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

        <TodoList
          preparedTodos={preparedTodos}
          setTodos={setTodos}
          handleError={handleError}
          tempTodo={tempTodo}
          focusInput={focusInput}
        />

        {todos.length > 0 && (
          <Footer
            completedTodosCount={completedTodosCount}
            status={status}
            setStatus={setStatus}
            preparedTodos={preparedTodos}
            setTodos={setTodos}
            focusInput={focusInput}
            handleError={handleError}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
