import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as todoService from './api/httpClient';
import { ErrorMessages, FilterStatus, Todo } from './types/Todo';
import { Header } from './component/Header';
import { Footer } from './component/Footer';
import { ErrorNotification } from './component/ErrorNotification';
import { TodoList } from './component/TodoList';
import { UserWarning } from './UserWarning';
import { TempTodo } from './component/TempTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.DEFAULT,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [isLoadingTodo, setIsLoadingTodo] = useState<number[]>([]);

  const handleErrorMessage = useCallback((message: ErrorMessages) => {
    setErrorMessage(message);
    const timeoutId = setTimeout(() => {
      setErrorMessage(ErrorMessages.DEFAULT);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setIsLoading(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => handleErrorMessage(ErrorMessages.LOAD_TODOS))
      .finally(() => setIsLoading(false));
  }, [handleErrorMessage]);

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.ACTIVE:
        return !todo.completed;
      case FilterStatus.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddTodo = useCallback(
    ({ id, title, completed, userId }: Todo) => {
      if (!query.trim()) {
        handleErrorMessage(ErrorMessages.EMPTY_TITLE);

        return;
      }

      setTempTodo({ id, title, completed, userId });
      (inputRef.current as HTMLInputElement).disabled = true;

      todoService
        .createTodo({ title, completed, userId })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setTempTodo(null);
          setQuery('');
          (inputRef.current as HTMLInputElement).disabled = false;
          inputRef.current?.focus();
        })
        .catch(() => {
          handleErrorMessage(ErrorMessages.ADD_TODO);
          setTempTodo(null);
          (inputRef.current as HTMLInputElement).disabled = false;
          inputRef.current?.focus();
        });
    },
    [handleErrorMessage, query],
  );

  const handleDeleteTodo = useCallback(
    (todoId: number) => {
      setIsLoadingTodo(prev => [...prev, todoId]);
      todoService
        .deleteTodo(todoId)
        .then(() => {
          const selectedTodo = todos.filter(todo => todo.id !== todoId);

          setTodos(selectedTodo);
          inputRef.current?.focus();
        })
        .catch(() => {
          handleErrorMessage(ErrorMessages.DELETE_TODO);
          inputRef.current?.focus();
        })
        .finally(() =>
          setIsLoadingTodo(prev => prev.filter(id => id !== todoId)),
        );
    },
    [handleErrorMessage, todos],
  );

  const handleDeleteAllCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsLoadingTodo(completedTodos.map(todo => todo.id));

    completedTodos.forEach(todo =>
      todoService
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(el => el.id !== todo.id),
          );
          inputRef.current?.focus();
        })
        .catch(() => {
          handleErrorMessage(ErrorMessages.DELETE_TODO);
          inputRef.current?.focus();
        })
        .finally(() => {
          setIsLoadingTodo([]);
        }),
    );
  }, [handleErrorMessage, todos]);

  const handleUpdateTodo = useCallback(
    (updatedTodo: Todo) => {
      setIsLoadingTodo(prev => [...prev, updatedTodo.id]);
      todoService
        .updateTodo(updatedTodo)
        .then(todo => {
          setTodos(currentTodos => {
            return currentTodos.map(item =>
              todo.id === item.id ? todo : item,
            );
          });
        })
        .catch(() => {
          setIsLoadingTodo(isLoadingTodo.filter(id => id !== updatedTodo.id));
          handleErrorMessage(ErrorMessages.UPDATE_TODO);
        })
        .finally(() => {
          setIsLoadingTodo(ids => ids.filter(id => id !== updatedTodo.id));
        });
    },
    [handleErrorMessage, isLoadingTodo],
  );

  const handleChangeCompletedAllTodos = useCallback(() => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    setTodos(updatedTodos);
    setIsLoadingTodo(todos.map(todo => todo.id));

    Promise.all(updatedTodos.map(todo => todoService.updateTodo(todo)))
      .catch(() => {
        handleErrorMessage(ErrorMessages.UPDATE_TODO);
        setTodos(todos);
      })
      .finally(() => setIsLoadingTodo([]));
  }, [todos, handleErrorMessage]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleChangeCompletedAllTodos={handleChangeCompletedAllTodos}
          handleAddTodo={handleAddTodo}
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
        />

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              handleDeleteTodo={handleDeleteTodo}
              isLoadingTodo={isLoadingTodo}
              handleUpdateTodo={handleUpdateTodo}
            />
            {tempTodo && <TempTodo tempTodo={tempTodo} />}
          </>
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            handleDeleteAllCompletedTodos={handleDeleteAllCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
