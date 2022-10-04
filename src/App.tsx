/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/Todos/ErrorNotification';
import { Footer } from './components/Todos/Footer';
import { Header } from './components/Todos/Header';
import { TodoList } from './components/Todos/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loader, setLoader] = useState(true);
  const [title, setTitle] = useState('');

  const filterTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.All:
        return todo;

      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default:
        return 0;
    }
  });

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  useEffect(() => {
    getTodos(userId)
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setError(true));
  }, []);

  if (error) {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          userId={userId}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
          setErrorMessage={setErrorMessage}
          setLoader={setLoader}
          title={title}
          setTitle={setTitle}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodos}
              setTodos={setTodos}
              setError={setError}
              setErrorMessage={setErrorMessage}
              loader={loader}
              title={title}
            />

            <Footer
              todos={filterTodos}
              filterType={filterType}
              setFilterType={setFilterType}
            />
          </>
        )}
      </div>
      <ErrorNotification
        error={error}
        setError={setError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
