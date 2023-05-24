/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer/Footer';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Status, ErrorType } from './enums/enums';
import { TodosList } from './components/TodosList/TodosList';
import { Error } from './components/Error/Error';
import { Context } from './context';

const USER_ID = 10326;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Error Data
  const [errorType, setErrorType] = useState(ErrorType.None);
  const [isErrorNotification, setIsErrorNotification] = useState(false);
  const isError = errorType !== ErrorType.None;
  const setError = useCallback((typeOfError: ErrorType) => {
    setErrorType(typeOfError);
    setTimeout(() => setErrorType(ErrorType.None), 3000);
  }, [ErrorType]);

  const errorMessage = useMemo(() => {
    switch (errorType) {
      case ErrorType.Add:
        return 'Unable to add a todo';

      case ErrorType.EmptyTitle:
        return 'Title can\'t be empty';

      case ErrorType.Delete:
        return 'Unable to delete a todo';

      case ErrorType.Update:
        return 'Unable to update a todo';

      default:
        return 'Something wrong';
    }
  }, [errorType]);

  // Header Data && Add Todo
  const todosCompleted = useMemo(() => todos
    .filter(todo => todo.completed), [todos]);
  const isActive = todosCompleted.length === todos.length;
  const [newTodoTitle, setNewTodoTitle] = useState('');

  // Add Todo
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const onAdd = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsUpdating(true);
    setError(ErrorType.None);

    if (newTodoTitle.trim() === '') {
      setError(ErrorType.EmptyTitle);

      return;
    }

    try {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: '',
        completed: false,
      });

      const responce = await addTodo(USER_ID, newTodoTitle);

      setTodos((prev) => [...prev, responce]);
    } catch {
      setError(ErrorType.Add);
    } finally {
      setTempTodo(null);
      setNewTodoTitle('');
      setIsUpdating(false);
    }
  };

  // Delete Todo
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const onDelete = async (id: number) => {
    setSelectedTodoId(id);
    setIsUpdating(true);
    setError(ErrorType.None);

    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch {
      setError(ErrorType.Delete);
    } finally {
      setIsUpdating(false);
    }
  };

  const completedTodosId = useMemo(() => {
    return todosCompleted.map(todo => todo.id);
  }, [todos]);

  const onDeleteCompleted = async () => {
    setIsUpdating(true);
    setError(ErrorType.None);
    try {
      await Promise.all(
        completedTodosId.map((id: number) => deleteTodo(id)),
      );
      setTodos((prev) => prev.filter(item => !item.completed));
    } catch (error) {
      setError(ErrorType.Delete);
    } finally {
      setIsUpdating(false);
    }
  };

  // Context Value
  const contextValue = {
    onDelete,
    onAdd,
  };

  // Get Todos From Server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responce = await getTodos(USER_ID);
        const todosFromServer = responce;

        setError(ErrorType.None);
        setTodos(todosFromServer);
      } catch (error) {
        setError(ErrorType.Add);
        Promise.reject();
      }
    };

    fetchData();
  }, []);

  // Todos Filter Data
  const [status, setStatus] = useState<Status>(Status.All);
  const filterTodos = (filter: Status) => {
    switch (filter) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const visibleTodos = filterTodos(status);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <Context.Provider value={contextValue}>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            newTodoTitle={newTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
            isActive={isActive}
            isUpdating={isUpdating}
          />

          {todos.length !== 0 && (
            <>
              <TodosList
                visibleTodos={visibleTodos}
                tempTodo={tempTodo}
                isUpdating={isUpdating}
                selectedTodoId={selectedTodoId}
                completedTodosId={completedTodosId}
              />

              <Footer
                status={status}
                setStatus={setStatus}
                todos={todos}
                onDeleteCompleted={onDeleteCompleted}
              />
            </>
          )}
        </div>

        <Error
          isError={isError}
          isErrorNotification={isErrorNotification}
          setIsErrorNotification={setIsErrorNotification}
          errorMessage={errorMessage}
        />
      </div>
    </Context.Provider>
  );
};
