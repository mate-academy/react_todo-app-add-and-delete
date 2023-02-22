/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { getTodos, deleteTodo } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { getVisibleTodos } from './utils/helpers';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorMessage/ErrorNotification';
import { Errors } from './types/Errors';

export const USER_ID = 6344;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [numberOfActive, setNumberOfActive] = useState(0);
  const [numberOfCompleted, setNumberOfCompleted] = useState(0);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.NO_ERROR);
  const [hasError, setHasErrorMessage] = useState(false);
  const [filterValue, setFilterValue] = useState<Filter>(Filter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isClearCompleted, setIsClearCompleted] = useState(false);

  const showError = useCallback((message: Errors) => {
    setErrorMessage(message);
    setHasErrorMessage(true);
    setTimeout(() => {
      setHasErrorMessage(false);
    }, 3000);
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
      console.log('todos setted');
    } catch (error) {
      showError(Errors.LOAD);
    }
  }, [todos]);

  const createTempTodo = (title: string) => {
    if (title) {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      });
    } else {
      setTempTodo(null);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    const counActive = todos.filter(todo => !todo.completed).length;
    const countCompleted = todos.length - counActive;

    setNumberOfActive(counActive);
    setNumberOfCompleted(countCompleted);
  }, [todos]);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(filterValue, todos)
  ), [filterValue, todos]);

  const handleSetFilterClick = useCallback((value:Filter) => {
    setFilterValue(value);
  }, []);

  const handleClearCompleted = async () => {
    setIsClearCompleted(true);

    try {
      await Promise.all(
        todos.filter(todo => todo.completed).map(todo => deleteTodo(todo.id)),
      );
    } catch {
      showError(Errors.DELETE);
    }

    await fetchTodos();
    setIsClearCompleted(false);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          numberOfActive={numberOfActive}
          getTodosFromServer={fetchTodos}
          showError={showError}
          userId={USER_ID}
          createTempTodo={createTempTodo}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          showError={showError}
          getTodosFromServer={fetchTodos}
          isClearCompleted={isClearCompleted}
        />

        {!!todos.length && (
          <Footer
            currentOption={filterValue}
            setOption={handleSetFilterClick}
            numberOfActive={numberOfActive}
            numberOfCompleted={numberOfCompleted}
            onClearCompleted={handleClearCompleted}
          />
        )}

      </div>

      <ErrorNotification
        isHidden={!hasError}
        message={errorMessage}
        setIsHidden={setHasErrorMessage}
      />

    </div>
  );
};
