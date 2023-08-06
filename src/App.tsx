/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { FilterType } from './types/filter';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { USER_ID, ERROR_TIMEOUT, FETCH_ERROR } from './utils/constants';
import { Header } from './components/Header';

const filterActive = (
  data: Todo[],
) => data.filter((todo) => todo.completed === false);

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [loadingTodos, setLoadingTodos] = useState<Todo[]>([]);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.Active:
        return filterActive(todos);
      case FilterType.Completed:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterType]);

  const activeLength = useMemo(
    () => filterActive(todos).length,
    [todos],
  );

  const completed = useMemo(
    () => todos.filter((todo) => todo.completed === true),
    [todos],
  );

  const errorHandler = useCallback((errorText: string) => {
    setErrorMessage(errorText);
    setTimeout(() => setErrorMessage(''), ERROR_TIMEOUT);
  }, [errorMessage]);

  useEffect(() => {
    setIsLoading(true);

    getTodos(USER_ID)
      .then((todosFromApi) => {
        setTodos(todosFromApi);
        setErrorMessage('');
      })
      .catch(() => {
        errorHandler(FETCH_ERROR);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeLength={activeLength}
          setTodos={setTodos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setTempTodo={setTempTodo}
          errorHandler={errorHandler}
        />

        <Main
          filteredTodos={filteredTodos}
          tempTodo={tempTodo}
          setTodos={setTodos}
          errorHandler={errorHandler}
          loadingTodos={loadingTodos}
          setLoadingTodos={setLoadingTodos}
        />

        {(todos.length > 0 || tempTodo)
        && (
          <>
            <Footer
              filterType={filterType}
              setFilterType={setFilterType}
              itemsAmount={activeLength}
              completed={completed}
              setTodos={setTodos}
              setLoadingTodos={setLoadingTodos}
              errorHandler={errorHandler}
            />
          </>
        )}
      </div>

      <div
        className={`notification is-danger is-light has-text-weight-normal ${cn({ hidden: !errorMessage })}`}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
