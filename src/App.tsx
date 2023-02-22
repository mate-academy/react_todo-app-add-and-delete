/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { addTodo, getTodos } from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { getVisibleTodos } from './utils/getVisibleTodos';
import { Filter } from './types/filter';
import { ErrorNotifications } from './types/ErrorNotifications';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { NewTodo } from './types/newTodo';

const USER_ID = 6390;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [errorMessage, setErrorMessage]
    = useState<ErrorNotifications>(ErrorNotifications.NONE);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const setErrorType = (error: ErrorNotifications) => {
    setErrorMessage(error);
  };

  useEffect(() => {
    const getTodosById = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        setError(true);
        setErrorType(ErrorNotifications.URL);
      }
    };

    getTodosById();
  }, []);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(todos, filter)
  ), [todos, filter]);

  const isThereCompleted = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const activeTodosAmount = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filterTodosBy = (condition: Filter) => {
    setFilter(condition);
  };

  const handleSetQuery = (value: string) => {
    setQuery(value);
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      setError(true);
      setErrorType(ErrorNotifications.TITLE);
    } else {
      const addedTodo: NewTodo = {
        userId: USER_ID,
        title: query,
        completed: false,
        id: 0,
      };

      setTempTodo({
        ...addedTodo,
      });
      try {
        setQuery('');
        setError(false);
        const justCreatedTodo = await addTodo(USER_ID, addedTodo);
        // console.log(justCreatedTodo, todos)

        setTodos(prevState => [...prevState, justCreatedTodo]);
      } catch (error) {
        setError(true);
        setErrorType(ErrorNotifications.ADD);
      } finally {
        setTempTodo(null);
      }
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {activeTodosAmount !== 0 && (
          <Header
            query={query}
            setQuery={handleSetQuery}
            handleSubmit={handleSubmit}
            tempTodo={tempTodo}
          />
        )}
        <TodoList todos={visibleTodos} />
        {todos.length && (
          <Footer
            filter={filter}
            filterTodosBy={filterTodosBy}
            activeTodosAmount={activeTodosAmount}
            isThereCompleted={isThereCompleted}
          />
        )}

      </div>

      {isError && (
        <ErrorMessage
          errorMessage={errorMessage}
          setError={setError}
        />
      )}
    </div>
  );
};
