/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { getTodos } from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

const USER_ID = 6396;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState('');

  const fetchAllTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setHasError(true);
      setErrorType('update');
    }
  };

  useEffect(() => {
    fetchAllTodos();
  }, []);

  const handleInput = (input: string) => {
    setQuery(input);
  };

  const handleFilterType = (filter: FilterType) => {
    setFilterType(filter);
  };

  const visibleTodos = useMemo(() => {
    let preparedTodos = [...todos];

    if (filterType) {
      switch (filterType) {
        case FilterType.All:
          preparedTodos = [...todos];
          break;
        case FilterType.Active:
          preparedTodos = todos.filter(todo => !todo.completed);
          break;
        case FilterType.Completed:
          preparedTodos = todos.filter(todo => todo.completed);
          break;
        default:
          throw new Error('Unexpected filter error');
      }
    }

    return preparedTodos;
  }, [query, todos, filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          query={query}
          todos={todos}
          handleInput={handleInput}
        />

        <TodoList todos={visibleTodos} />

        {todos.length && (
          <Footer
            todos={visibleTodos}
            filterType={filterType}
            handleFilterType={handleFilterType}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {hasError && (
        <Notification errorType={errorType} />
      )}
    </div>
  );
};
