import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { USER_ID } from './constants';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorType } from './types/Error';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [processings, setProcessings] = useState<number[]>([]);

  const filterTodos = () => {
    switch (filter) {
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);
      case Filter.ALL:
      default:
        return [...todos];
    }
  };

  useEffect(() => {
    const uploadTodos = async () => {
      try {
        const uploadedTodos = await getTodos(USER_ID);

        setTodos(uploadedTodos);
      } catch (err) {
        setError(ErrorType.LOAD);
      }
    };

    uploadTodos();
  }, []);

  const handleErrorMessageHidden = () => {
    setError(ErrorType.NONE);
  };

  const filteredTodos = useMemo(() => filterTodos(), [filter, todos]);

  useEffect(
    () => {
      if (error === ErrorType.NONE) {
        return () => {};
      }

      const timerId = setTimeout(() => setError(ErrorType.NONE), 3000);

      return () => {
        clearTimeout(timerId);
      };
    },
    [error],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          setError={setError}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          setProcessings={setProcessings}
        />

        <TodoList
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          processings={processings}
          setTodos={setTodos}
          setError={setError}
          setProcessings={setProcessings}
        />

        {!!filteredTodos && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            setError={setError}
            setTodos={setTodos}
            setProcessings={setProcessings}
          />
        )}
      </div>

      <div
        className={
          classNames(
            'notification is-danger is-light has-text-weight-normal', {
              hidden: !error,
            },
          )
        }
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          className="delete"
          onClick={handleErrorMessageHidden}
        />
        {error}
      </div>
    </div>
  );
};
