import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { ErrorTypes, FilterTypes } from './types/enums';
import { handleError, prepareVisibleTodos } from './utils/services';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes>(ErrorTypes.def);
  const [filterBy, setFilterBy] = useState<FilterTypes>(FilterTypes.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleError(ErrorTypes.loadErr, setErrorMessage));
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
          tempTodo={tempTodo}
        />
        <TodoList
          todos={prepareVisibleTodos(todos, filterBy)}
          loading={loading}
          setLoading={setLoading}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          tempTodo={tempTodo}
          setIsFocused={setIsFocused}
        />
        {(todos.length > 0 || tempTodo) && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            todos={todos}
            setLoading={setLoading}
            setTodos={setTodos}
            setIsFocused={setIsFocused}
            setErrorMessage={setErrorMessage}
          />
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
