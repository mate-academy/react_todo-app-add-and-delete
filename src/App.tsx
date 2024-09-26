import React, { useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { ErrorTypes, FilterTypes } from './types/enums';
import { handleError, prepareVisibleTodos } from './utils/services';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes>(ErrorTypes.def);
  const [filterBy, setFilterBy] = useState<FilterTypes>(FilterTypes.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isFocused, setIsFocused] = useState(true);
  const areTodosExist = todos.length > 0 || tempTodo;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleError(ErrorTypes.OnLoadErr, setErrorMessage));
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
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          setIsLoading={setIsLoading}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
        />
        <TodoList
          todos={prepareVisibleTodos(todos, filterBy)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          tempTodo={tempTodo}
          setIsFocused={setIsFocused}
        />
        {areTodosExist && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            todos={todos}
            setIsLoading={setIsLoading}
            setTodos={setTodos}
            setIsFocused={setIsFocused}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
