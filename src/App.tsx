import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { ErrorTypes, FilterTypes } from './types/enums';
import { handleError, prepareVisibleTodos } from './utils/services';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes>(ErrorTypes.def);
  const [filterBy, setFilterBy] = useState<FilterTypes>(FilterTypes.All);
  const [tempTodo, setTempTodo] = useState<Todo[]>([]);
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    setLoading(tempTodo.map(todo => todo.id));
  }, [tempTodo]);

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => handleError(ErrorTypes.loadErr, setErrorMessage))
      .finally(() => {
        setIsLoading(false);
      });
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
          setLoading={setLoading}
          setTempTodo={setTempTodo}
        />
        {(todos.length > 0 || tempTodo.length > 0) && (
          <>
            <TodoList
              todos={prepareVisibleTodos(todos, filterBy)}
              isLoading={isLoading}
              loading={loading}
              setLoading={setLoading}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              tempTodo={tempTodo}
              setIsFocused={setIsFocused}
            />
            <Footer
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              todos={todos}
              setLoading={setLoading}
              setTodos={setTodos}
              setIsFocused={setIsFocused}
              setErrorMessage={setErrorMessage}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === ErrorTypes.def },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => handleError(ErrorTypes.def, setErrorMessage)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
