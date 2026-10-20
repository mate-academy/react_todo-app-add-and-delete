import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';
import { getVisibleTodos } from './utils/getVisibleTodos';

const ERROR_DISPLAY_DURATION = 3000;

type TodoError = {
  message: ErrorMessage;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [error, setError] = useState<TodoError | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    let isCancelled = false;

    setError(null);

    getTodos()
      .then(loadedTodos => {
        if (!isCancelled) {
          setTodos(loadedTodos);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError({ message: ErrorMessage.Load });
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setError(null);
    }, ERROR_DISPLAY_DURATION);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [error]);

  useEffect(() => {
    if (!isLoading && !tempTodo) {
      inputRef.current?.focus();
    }
  }, [isLoading, tempTodo]);

  const handleCloseError = () => {
    setError(null);
  };

  const handleAdd = async (newTitle: string) => {
    setError(null);

    if (!newTitle) {
      setError({ message: ErrorMessage.EmptyTitle });
      inputRef.current?.focus();

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTitle,
      completed: false,
    });

    try {
      const createdTodo = await addTodo(newTitle);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      setError({ message: ErrorMessage.Add });
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    setDeletingIds(currentIds => [...currentIds, todoId]);
    setError(null);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => {
        return currentTodos.filter(({ id }) => id !== todoId);
      });
    } catch {
      setError({ message: ErrorMessage.Delete });
    } finally {
      setDeletingIds(currentIds => {
        return currentIds.filter(id => id !== todoId);
      });

      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = () => {
    todos
      .filter(({ id, completed }) => {
        return completed && !deletingIds.includes(id);
      })
      .forEach(({ id }) => {
        void handleDelete(id);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodosCount = todos.filter(({ completed }) => {
    return !completed;
  }).length;

  const hasTodos = todos.length > 0;
  const hasCompletedTodos = todos.some(({ completed }) => completed);
  const allTodosCompleted = hasTodos && activeTodosCount === 0;
  const visibleTodos = getVisibleTodos(todos, status);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={hasTodos}
          allTodosCompleted={allTodosCompleted}
          title={title}
          isDisabled={isLoading || tempTodo !== null}
          inputRef={inputRef}
          onTitleChange={setTitle}
          onAdd={handleAdd}
        />

        {(hasTodos || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletingIds={deletingIds}
            onDelete={handleDelete}
          />
        )}

        {hasTodos && (
          <Footer
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            status={status}
            onStatusChange={setStatus}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={error?.message ?? ErrorMessage.None}
        onClose={handleCloseError}
      />
    </div>
  );
};
