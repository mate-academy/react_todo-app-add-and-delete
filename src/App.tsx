/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, postTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Sort } from './utils/Sort';
import { ErrorType } from './utils/ErrorType';
import { TodosList } from './components/TodosList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Error } from './components/Error';

const USER_ID = 10360;

export const App: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [sortType, setSortType] = useState<Sort>(Sort.All);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.None);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number[]>([0]);

  const errorNotification = useCallback((type: ErrorType) => {
    setErrorType(type);
    setTimeout(() => {
      setErrorType(ErrorType.None);
    }, 3000);
  }, [errorType]);

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      errorNotification(ErrorType.Add);
    }
  }, []);

  const sendTodo = async (todoData: Todo) => {
    setIsInputDisabled(true);
    setTempTodo(todoData);
    try {
      const todo = await postTodo(todoData);

      setTodos([...todos, todo]);
    } catch {
      errorNotification(ErrorType.Add);
    }

    setIsInputDisabled(false);
    setTempTodo(null);
  };

  const deleteTodo = async (todoId: number) => {
    setSelectedTodoId((prevTodo) => [...prevTodo, todoId]);
    setIsLoading(true);
    try {
      await removeTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      errorNotification(ErrorType.Delete);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodosId = todos.filter(todo => todo.completed)
      .map(todo => todo.id);

    setIsLoading(true);
    try {
      await Promise.all(completedTodosId.map(id => deleteTodo(id)));
      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      errorNotification(ErrorType.Delete);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const sortingTodos = useCallback((type: Sort) => {
    switch (type) {
      case Sort.Active:
        return todos.filter(todo => !todo.completed);
      case Sort.Completed:
        return todos.filter(todo => todo.completed);
      case Sort.All:
      default:
        return todos;
    }
  }, [errorType, todos]);

  const setErrorMessage = useCallback(() => {
    switch (errorType) {
      case ErrorType.Add:
        return 'Unable to add a todo';
      case ErrorType.Delete:
        return 'Unable to delete a todo';
      case ErrorType.Update:
        return 'Unable to update a todo';
      case ErrorType.Empty:
        return 'Title can\'t be empty';
      default:
        return 'Unpredictable error';
    }
  }, [errorType]);

  const isAnyActiveTodo = useMemo(() => {
    return todos.some(todo => !todo.completed);
  }, [todos]);
  const isAnyCompletedTodo = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);
  const itemsLeftToComplete = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);
  const sortedTodos = sortingTodos(sortType);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          sendTodo={sendTodo}
          isAnyActiveTodo={isAnyActiveTodo}
          errorNotification={errorNotification}
          isInputDisabled={isInputDisabled}
        />

        <TodosList
          todos={sortedTodos}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
          selectedTodoId={selectedTodoId}
        />

        {todos.length > 0 && (
          <Footer
            itemsLeftToComplete={itemsLeftToComplete}
            isAnyCompletedTodo={isAnyCompletedTodo}
            sortType={sortType}
            setSortType={setSortType}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      {errorType !== ErrorType.None && (
        <Error
          setHasError={setErrorType}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
