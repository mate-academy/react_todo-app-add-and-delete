import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';

import { deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { FilterMode } from './types/FilterMode';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodosFilter } from './components/TodosFilter';
import { ErrorMessage } from './components/ErrorMessage';
import { NewTodoForm } from './components/NewTodoForm';
import { TodoInfo } from './components/TodoInfo';
import { Loader } from './components/Loader';
import { LoadingTodosContext } from './components/LoadingTodosContext';

const USER_ID = 6826;

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [shouldShowError, setShouldShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [
    currentFilterMode,
    setCurrentFilterMode,
  ] = useState<FilterMode>(FilterMode.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // eslint-disable-next-line no-unused-vars
  const {
    loadingTodosIds,
    setLoadingTodosIds,
  } = useContext(LoadingTodosContext);

  const visibleTodos = useMemo(() => (
    allTodos.filter(({ completed }) => {
      switch (currentFilterMode) {
        case FilterMode.Active:
          return !completed;

        case FilterMode.Completed:
          return completed;

        default:
          return true;
      }
    })
  ), [allTodos, currentFilterMode]);

  const activeTodos = useMemo(() => (
    allTodos.filter(({ completed }) => !completed)
  ), [allTodos]);

  const completedTodosIds = useMemo(() => (
    allTodos
      .filter(({ completed }) => completed)
      .map(({ id }) => id)
  ), [allTodos]);

  const showError = useCallback((errorText: string) => {
    setErrorMessage(errorText);
    setShouldShowError(true);
    setTimeout(() => {
      setShouldShowError(false);
    }, 3000);
  }, []);

  const handleErrorMessageClose = useCallback(() => {
    setShouldShowError(false);
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    setLoadingTodosIds(prevIds => [...prevIds, ...completedTodosIds]);

    try {
      await Promise.all(completedTodosIds.map(id => deleteTodo(id)));

      setAllTodos(activeTodos);
    } catch {
      showError('Unable to delete all completed todos');
    } finally {
      setLoadingTodosIds(prevIds => prevIds.filter(
        prevId => !completedTodosIds.includes(prevId),
      ));
    }
  }, [loadingTodosIds, allTodos]);

  const loadTodosFromServer = useCallback(async () => {
    setIsLoadingTodos(true);
    setShouldShowError(false);

    try {
      const todosFromServer = await getTodos(USER_ID);

      setAllTodos(todosFromServer);
    } catch {
      showError('Unable to load todos');
    } finally {
      setIsLoadingTodos(false);
    }
  }, []);

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  window.console.log('rendering app');

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">
        todos
      </h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="Toggle"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              { active: activeTodos.length },
            )}
          />

          <NewTodoForm
            userId={USER_ID}
            showError={showError}
            setAllTodos={setAllTodos}
            setTempTodo={setTempTodo}
          />
        </header>

        {isLoadingTodos && (
          <Loader />
        )}

        {allTodos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              showError={showError}
              setAllTodos={setAllTodos}
            />

            {tempTodo && (
              <TodoInfo
                todo={tempTodo}
                showError={showError}
                setAllTodos={setAllTodos}
              />
            )}

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodos.length} items left`}
              </span>

              <TodosFilter
                currentFilterMode={currentFilterMode}
                onFilterModeChange={setCurrentFilterMode}
              />

              <button
                type="button"
                className={classNames(
                  'todoapp__clear-completed',
                  { 'is-invisible': !completedTodosIds.length },
                )}
                onClick={() => clearCompletedTodos()}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        shouldBeShown={shouldShowError}
        onClose={handleErrorMessageClose}
      />
    </div>
  );
};
