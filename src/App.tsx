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
import { Loader } from './Loader';

const USER_ID = 6755;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [filterType, setFilterType] = useState<FilterParam>(FilterParam.All);
  const [errorType, setErrorType] = useState(ErrorType.None);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [loadingTodo, setLoadingTodo] = useState([0]);

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

  const addNewTodo = useCallback((newTodo: Todo): void => {
    setTodos((oldTodos) => [...oldTodos, newTodo]);
  },
  []);

  const showError = useCallback((error: ErrorType) => {
    setErrorType(error);
    setHasError(true);
  }, []);

  const hideError = useCallback(() => {
    setHasError(false);
  }, []);

  const removeTodo = async (todoId: any) => {
    try {
      setLoadingTodo(prevTodo => [...prevTodo, todoId]);

      await deleteTodo(todoId);
      setTodos(todoForDelete => (
        todoForDelete.filter(todo => todo.id !== todoId)
      ));
    } catch {
      setHasError(true);
      showError(ErrorType.Delete);
    } finally {
      setLoadingTodo([0]);
    }
  };

  const addNewTodoInList = async (newTodo: any) => {
    try {
      const downloadNewTodo = await addTodo(USER_ID, newTodo);

      addNewTodo(downloadNewTodo);
    } catch {
      showError(ErrorType.Add);
    } finally {
      setTitle('');
      setTempTodo(null);
    }
  };

  const handleFormSubmit = (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      showError(ErrorType.EmptyTitle);
      setTitle('');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    addNewTodoInList(newTodo);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <Loader.Provider value={loadingTodo}>
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
                tempTodo={tempTodo}
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
    </Loader.Provider>
  );
};
