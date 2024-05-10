import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getData } from './api/todos';
import { TypeTodo } from './types/Todo';
import classNames from 'classnames';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  const [inputFocus, setInputFocus] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [todos, setTodos] = useState<TypeTodo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const allTodosCompleted = todos.every(todo => todo.completed);
  const hasAnyTodos = todos.length !== 0;

  const filteredTodo = todos.filter(todo => {
    if (filterType === FilterType.Active) {
      return !todo.completed;
    }

    if (filterType === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    setIsLoading(true);
    getData()
      .then(response => {
        setTodos(response);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          inputRef={inputRef}
          inputFocus={inputFocus}
          setIsLoading={setIsLoading}
          setInputFocus={setInputFocus}
          setErrorMessage={setErrorMessage}
          allTodosCompleted={allTodosCompleted}
        />

        <TodoList
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setErrorMessage={setErrorMessage}
          todos={todos}
          filteredTodo={filteredTodo}
          setTodos={setTodos}
          setInputFocus={setInputFocus}
        />

        {/* Hide the footer if there are no todos */}
        {hasAnyTodos && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            filterType={filterType}
            setIsLoading={setIsLoading}
            setFilterType={setFilterType}
            setInputFocus={setInputFocus}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={
          classNames(
            "notification is-danger is-light has-text-weight-normal",
            {"hidden": errorMessage === "" }
          )
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
