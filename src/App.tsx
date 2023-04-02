import React, { useEffect, useState, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { filterTodos } from './helpers/helpers';
import { FilterParam } from './types/FilterParam';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorType } from './types/ErrorType';
import { Error } from './components/Error';

const USER_ID = 6755;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [filterType, setFilterType] = useState<FilterParam>(FilterParam.All);
  const [errorType, setErrorType] = useState(ErrorType.None);
  const [title, setTitle] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const fetchTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setHasError(true);
      setErrorType(ErrorType.Load);
    }
  };

  const addNewTodo = useCallback(
    (newTodo: Todo): void => setTodos((oldTodos) => [...oldTodos, newTodo]),
    [],
  );

  const showError = useCallback((error: ErrorType) => {
    setErrorType(error);
    setHasError(true);
  }, []);

  const hideError = useCallback(() => {
    setHasError(false);
  }, []);

  const removeTodo = (todoId: number) => {
    deleteTodo(todoId)

      .then(() => fetchTodos())
      .catch(() => {
        setHasError(true);
        showError(ErrorType.Delete);
      });
  };

  const handleFormSubmit = (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      showError(ErrorType.EmptyTitle);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    const addNewTodoInList = async () => {
      try {
        const downloadNewTodo = await addTodo(USER_ID, newTodo);

        addNewTodo(downloadNewTodo);
      } catch {
        showError(ErrorType.Add);
      } finally {
        setTitle('');
      }
    };

    addNewTodoInList();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={handleTextChange}
          handleFormSubmit={handleFormSubmit}
        />

        {todos && (
          <>
            <TodoList
              todos={filterTodos(todos, filterType)}
              removeTodo={removeTodo}
            />
            <Footer
              todos={todos}
              filterType={filterType}
              setFilterType={setFilterType}
              removeTodo={removeTodo}
            />
          </>
        )}
      </div>

      {hasError && (
        <Error
          errorType={errorType}
          hasError={hasError}
          onNotificationClose={hideError}
        />
      )}
    </div>
  );
};
