/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Section } from './Components/Todolist';
import { TodosFooter } from './Components/TodosFooter';
import { client } from './utils/fetchClient';

const USER_ID = 'https://mate.academy/students-api/todos?userId=11910';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [typeError, setTypeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const LOADING = 'loading';
  const ADD = 'add';
  // const DELETE = 'delete'; це знадобиться у слідуючій частині цього завдання
  // const CHANGE = 'change';
  const EMPTY = 'empty';

  useEffect(() => {
    // Функция для загрузки данных с сервера
    const fetchTodos = async () => {
      try {
        // throw new Error();
        setIsLoading(true);
        const response = await client.getAll<Todo[]>();

        setTodos(response);
      } catch (error) {
        setIsError(true);
        setTypeError(LOADING);

        setTimeout(() => {
          setIsError(false);
          setTypeError('');
        }, 3000);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    // Вызываем функцию загрузки при открытии страницы (монтировании компонента)
    fetchTodos();
  }, []); // Пустой массив зависимостей гарантирует, что useEffect сработает только при монтировании

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const obj = {
      id: Math.floor(Math.random() * 1000),
      title: inputValue,
      completed: false,
      userId: 11910,
    };

    setTempTodo(obj);

    try {
      if (inputValue.trim().length === 0) {
        throw new Error('empty');
      }

      const response = await client.post<Todo>('/todos?userId=11910', obj);

      setTodos((prevTodos) => [
        ...prevTodos,
        response]);
    } catch (error: any) {
      setIsError(true);

      if (error.message === 'empty') {
        setTypeError(EMPTY);
      } else {
        setTypeError(ADD);
      }

      setTimeout(() => {
        setIsError(false);
        setTypeError('');
      }, 3000);
    } finally {
      setTimeout(() => {
        setTempTodo(null);
      }, 1000);
    }

    setInputValue('');
  };

  const handleError = (Error: string) => {
    switch (Error) {
      case 'loading':
        return 'Unable to load todos';
      case 'add':
        return 'Unable to add a todo';
      case 'delete':
        return 'Unable to delete a todo';
      case 'change':
        return 'Unable to update a todo';
      case 'empty':
        return 'Title should not be empty';
      default:
        return 'null';
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos + */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all',
              { active: todos.find(todo => !todo.completed) })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit + */}
          <form onSubmit={handleSubmit}>
            <input
              // autoFocus
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              disabled={isLoading}
            />
          </form>
        </header>

        <Section
          filterType={filterType}
          todos={todos}
          setTodos={setTodos}
          isLoading={isLoading}
          setIsError={setIsError}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos + */}
        {todos.length !== 0 && (
          <TodosFooter
            todos={todos}
            setTodos={setTodos}
            filterType={filterType}
            setFilterType={setFilterType}
            setIsError={setIsError}
            setTempTodo={setTempTodo}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      {isError && (
        <div
          data-cy="ErrorNotification"
          className={
            classNames('notification is-danger is-light has-text-weight-normal',
              {
                hidden: !isError,
              })
          }
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsError(false)}
          />
          {handleError(typeError)}
        </div>
      )}
    </div>
  );
};
