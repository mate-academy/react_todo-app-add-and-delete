/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TypeTodos } from './types/type';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { TodoFilter } from './components/Footer/TodoFilter';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { TodoError } from './components/TodoError/TodoError';
import { ErrorType } from './types/error';

const USER_ID = 11299;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeTodos, setTypeTodos] = useState<TypeTodos>(TypeTodos.All);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const handleError = (errorType: ErrorType,
    errorFunction: (errorType: ErrorType) => void) => {
    errorFunction(errorType);
    setTimeout(() => {
      errorFunction(ErrorType.None);
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        handleError(ErrorType.Load, setErrorMessage);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (typeTodos) {
      case TypeTodos.Active:
        return todos.filter(todo => !todo.completed);
      case TypeTodos.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, typeTodos]);

  const deleted = (postId: number) => {
    setLoadingTodosIds(prevTodo => [...prevTodo, postId]);
    deleteTodos(postId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== postId));
      })
      .catch(() => {
        handleError(ErrorType.Delete, setErrorMessage);
      })
      .finally(() => {
        setLoadingTodosIds(
          prevTodo => prevTodo.filter(id => id !== postId),
        );
      });
  };

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setTempTodo({ id: 0, ...newTodo });
    setIsLoading(true);
    addTodos(newTodo)
      .then((addedTodo) => {
        setTodos(prevTodo => [...prevTodo, addedTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorType.Add);
        setTempTodo(null);
        handleError(ErrorType.Add, setErrorMessage);
      })
      .finally(() => setIsLoading(false));
  };

  const deleteCompletedTodos = () => {
    const allCompletedId
    = todos.filter(todo => todo.completed).map(todo => todo.id);

    setLoadingTodosIds(prev => [...prev, ...allCompletedId]);

    Promise.all(allCompletedId.map(todoId => deleteTodos(todoId)))
      .then(() => {
        setTodos(todos.filter(todo => !todo.completed));
      })
      .catch(() => {
        handleError(ErrorType.Delete, setErrorMessage);
      })
      .finally(() => {
        setLoadingTodosIds(
          prev => prev.filter(id => !allCompletedId.includes(id)),
        );
      });
  };

  const closeNotification = () => {
    setErrorMessage(ErrorType.None);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
        />
        <TodoList
          filteredTodos={filteredTodos}
          deleted={deleted}
          todos={todos}
          setTodos={setTodos}
          tempTodo={tempTodo}
          isLoading={isLoading}
          loadingTodosIds={loadingTodosIds}
        />
        <TodoFilter
          todos={todos}
          setTypeTodos={setTypeTodos}
          deleteCompletedTodos={deleteCompletedTodos}
        />
      </div>
      {errorMessage !== ErrorType.None && (
        <TodoError
          errorMessage={errorMessage}
          closeNotification={closeNotification}
        />
      )}
    </div>
  );
};
