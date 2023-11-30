/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Filter } from './types/Filter';
import { ErrorNotification } from './types/ErrorNotification';
import { Error } from './components/Error';

const USER_ID = 11988;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage]
    = useState<ErrorNotification>(ErrorNotification.Default);

  useEffect(() => {
    setErrorMessage(ErrorNotification.Default);
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorNotification.LoadError));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {todos.length !== 0 && (
          <>
            <TodoList todos={filteredTodos} />
            <Footer
              setFilter={setFilter}
              filterOption={filter}
              todos={todos}
            />
          </>
        )}
      </div>

      <Error errorMessage={errorMessage} />
    </div>
  );
};
