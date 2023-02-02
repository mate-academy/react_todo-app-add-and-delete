/* eslint-disable curly */

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodosProvider } from './components/TodosContext';

import { getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [isError, setIsError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isTemp] = useState<Todo[] | null>([{
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  }]);

  const user = useContext(AuthContext);

  const setTodosList = () => {
    if (!user) {
      return;
    }

    setTodos(isTemp);
    getTodos(user.id)
      .then(data => setTodos(data))
      .catch(() => {
        setIsError(Error.Update);
        setTodos(null);
      });
  };

  const filteredTodos = () => {
    if (!todos) return null;

    return todos?.filter((todo) => {
      switch (filter) {
        case Filter.Active: return !todo.completed;
        case Filter.Completed: return todo.completed;
        case Filter.All:
        default:
          return true;
      }
    });
  };

  const setFilterStatus = (arg: Filter) => {
    setFilter(arg);
  };

  const setErrorsArgument = (argument: Error | null) => {
    setIsError(null);
    setIsError(argument);
  };

  useEffect(() => {
    setTodosList();
  }, []);

  return (
    <TodosProvider
      setErrorsArgument={setErrorsArgument}
      setTodos={setTodos}
      todos={todos}
      setTodosList={setTodosList}
    >
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <Header
            setErrorsArgument={setErrorsArgument}
            setTodosList={setTodos}
            todos={todos}
          />
          {todos && (
            <TodoList todos={filteredTodos()} />
          )}
          <Footer
            filter={filter}
            setFilter={setFilterStatus}
            todos={todos}
            setErrorsArgument={setErrorsArgument}
            setTodos={setTodos}
          />
        </div>

        {isError && (
          <ErrorNotification
            error={isError}
            setIsError={setIsError}
          />
        )}
      </div>
    </TodosProvider>
  );
};
