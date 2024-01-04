/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, FilterType } from './types';
import { getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Error } from './components/Error';

const USER_ID = 12139;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(
    () => {
      getTodos(USER_ID)
        .then(setTodos)
        .catch((error) => {
          setErrorMessage(`Unable to load todos. Please try again. ${error}`);
        });
    }, [],
  );

  const addTodo = (todo: Todo) => {
    setTodos(prev => [...prev, todo]);
  };

  const todosToRender = useMemo(
    () => {
      return todos.filter(todo => {
        return filterType === FilterType.ALL
          || (filterType === FilterType.COMPLETED ? todo.completed : !todo.completed);
      });
    },
    [todos, filterType],
  );

  const hideErrorMessage = () => {
    setErrorMessage(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header addTodo={addTodo} />

        <TodoList
          todos={todosToRender}
          setTodos={setTodos}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setFilterType={setFilterType}
            filterType={filterType}
          />
        )}
      </div>

      {errorMessage && (
        <Error
          hideErrorMessage={hideErrorMessage}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
