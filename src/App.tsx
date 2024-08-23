/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import Header from './components/Header';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Errors';
import { Status } from './types/Status';
import TodoList from './components/ToDoList';
import ErrorNotification from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Status>(Status.ALL);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorType(ErrorType.LOAD_TODOS))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let timer = 0;

    if (errorType) {
      timer = window.setTimeout(() => setErrorType(null), 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorType]);

  const handleCloseError = () => setErrorType(null);

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorType(ErrorType.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({ id: 0, ...newTodo });

    try {
      const createdTodo = await createTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      console.error(error);
      setErrorType(ErrorType.LOAD_TODOS);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      console.error(error);
      setErrorType(ErrorType.DELETE_TODO);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      const results = await Promise.allSettled(deletePromises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== completedTodos[index].id),
          );
        } else {
          console.error(`Failed to delete todo ${completedTodos[index].id}`);
          setErrorType(ErrorType.DELETE_TODO);
        }
      });
    } catch (error) {
      console.error(error);
      setErrorType(ErrorType.DELETE_TODO);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === Status.ACTIVE) {
      return !todo.completed;
    }

    if (filter === Status.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.length - activeTodosCount;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          isSubmitting={isLoading}
          setErrorType={setErrorType}
        />

        <TodoList
          todos={filteredTodos}
          onDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            activeCount={activeTodosCount}
            completedCount={completedTodosCount}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorType={errorType}
        handleCloseError={handleCloseError}
      />
    </div>
  );
};
