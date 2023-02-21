/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMassage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorType } from './types/ErrorType';
import { FilterField } from './types/FilterField';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { prepareTodos } from './utils/prepareTodos';

const USER_ID = 6372;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(ErrorType.NONE);
  const [isError, setIsError] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterField>(FilterField.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const count = todos.length;

  const preparedTodos = useMemo(() => {
    return prepareTodos(filterBy, todos);
  }, [filterBy, todos]);

  const isActive = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const completedTodo = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const fetchTodos = async (userId: number) => {
    try {
      const data = await getTodos(userId);

      setTodos(data);
    } catch {
      setHasError(ErrorType.UPLOAD_ERROR);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchTodos(USER_ID);
  }, [USER_ID]);

  const errorClose = useCallback(() => {
    setIsError(false);
  }, []);

  const setFilterByField = useCallback((field: FilterField) => {
    setFilterBy(field);
  }, []);

  const changeHasError = useCallback((typeError: ErrorType) => {
    return setHasError(typeError);
  }, []);

  const changeIsError = useCallback(() => {
    return setIsError(true);
  }, []);

  const addTempTodo = useCallback((todo: Todo | null) => {
    return setTempTodo(todo);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          count={count}
          isActiveCount={isActive.length}
          userId={USER_ID}
          fetchTodos={fetchTodos}
          changeHasError={changeHasError}
          changeIsError={changeIsError}
          addTempTodo={addTempTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={preparedTodos}
              userId={USER_ID}
              fetchTodos={fetchTodos}
              changeHasError={changeHasError}
              changeIsError={changeIsError}
              tempTodo={tempTodo}
            />

            <Footer
              filterBy={filterBy}
              isActiveCount={isActive.length}
              hascompletedTodo={completedTodo.length}
              onSetFilterByField={setFilterByField}
            />
          </>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {isError
        && (
          <ErrorMessage
            errorMassage={hasError}
            onErrorClose={errorClose}
            isError={isError}
          />
        )}
    </div>
  );
};
