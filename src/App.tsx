/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { useTodoContext } from './context';
import { Todo } from './types/Todo';

const USER_ID = 12113;

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setAllTodos, visibleTodos } = useTodoContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const errorHandler = (message: string) => {
    setErrorMessage(null);
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = query.trim();

    if (trimmedTitle === '') {
      errorHandler('Title should not be empty');

      return;
    }

    setIsLoading(true);

    try {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      const addedTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setAllTodos((prevTodos: Todo[]) => ([...prevTodos, addedTodo]));

      setTempTodo(null);
      setQuery('');
      setIsLoading(false);
    } catch (error) {
      setTempTodo(null);
      setIsLoading(false);
      errorHandler('Unable to add Todo');
    }
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await getTodos(USER_ID);

        setAllTodos(todos);
      } catch (error) {
        errorHandler('Unable to load todos');
      }
    };

    loadTodos();
  }, [setAllTodos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {visibleTodos?.some(todo => !todo.completed)
          && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              value={query}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              onChange={handleQuery}
              disabled={isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList tempTodo={tempTodo} />
        </section>
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
        hidden={!errorMessage}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {/* show only one message at a time */}
        {errorMessage && <span>{errorMessage}</span>}
        {/*
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
