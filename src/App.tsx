import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [fetchedTodos, setFetchedTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'completed'>(
    'all',
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedTodoIds, setCompletedTodoIds] = useState<number[] | null>(
    null,
  );
  const [isHiddenError, setIsHiddenError] = useState(true);

  const timeoutRef = useRef<number | null>(null);

  const removeErrorMessage = () => {
    setIsHiddenError(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 1000);
  };

  const handleDelete = (id: number) => {
    setTodos(prevTodo => prevTodo.filter(todo => todo.id !== id));
  };

  const errorMessageHandler = useCallback((er: Error) => {
    setErrorMessage(er.message ?? String(er));
    setIsHiddenError(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      removeErrorMessage();
    }, 3000);
  }, []);
  // <br />
  // Unable to update a todo

  useEffect(() => {
    getTodos()
      .then(serverTodos => {
        setTodos(serverTodos);
        setFetchedTodos(serverTodos);
      })
      .catch(errorMessageHandler);
  }, []);

  useEffect(() => {
    let filteredTodos = todos;

    if (filterBy !== 'all') {
      filteredTodos = todos.filter(todo =>
        filterBy === 'active' ? !todo.completed : todo.completed,
      );
    }

    setFetchedTodos([...filteredTodos]);
  }, [filterBy, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onError={errorMessageHandler}
          onSuccess={setTodos}
          setTempTodo={setTempTodo}
          errorMessage={errorMessage}
        />

        <TodoList
          renderedList={fetchedTodos}
          tempTodo={tempTodo}
          todos={todos}
          forClear={completedTodoIds}
          setForClear={setCompletedTodoIds}
          onDelete={setTodos}
          onError={errorMessageHandler}
          handleDelete={handleDelete}
        />

        {/* Hide the footer if there are no todos */}
        {(tempTodo || !!todos.length) && (
          <Footer
            filterBy={filterBy}
            setFilter={setFilterBy}
            todos={todos}
            onClearCompleted={setCompletedTodoIds}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessage
        errorMessage={errorMessage}
        removeError={removeErrorMessage}
        isHiddenError={isHiddenError}
      />
    </div>
  );
};
