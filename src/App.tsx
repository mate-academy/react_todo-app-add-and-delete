import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, createTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/Filter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState('');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setloadingTodoIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleAddTodo = (title: string): Promise<void> => {
    setIsSubmitting(true);
    setErrorMessage('');

    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });

    return createTodo(title)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');

        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage('');
    setloadingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setloadingTodoIds(prev => prev.filter(id => id !== todoId));
        focusInput();
      });
  };

  const handleClearCompleted = () => {
    setErrorMessage('');
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setloadingTodoIds(prev => [...prev, ...completedIds]);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => null),
    );

    Promise.all(deletePromises).then(results => {
      const successfulIds = results.filter((id): id is number => id !== null);

      if (successfulIds.length < completedTodos.length) {
        setErrorMessage('Unable to delete a todo');
      }

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfulIds.includes(todo.id)),
      );

      setloadingTodoIds(prev => prev.filter(id => !completedIds.includes(id)));
      focusInput();
    });
  };

  const handleSetError = (message: string) => {
    setErrorMessage('');
    setTimeout(() => {
      setErrorMessage(message);
    });
  };

  const handleCloseError = () => {
    setErrorMessage('');
  };

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          activeTodosCount={activeTodosCount}
          onAddTodo={handleAddTodo}
          isSubmitting={isSubmitting}
          onError={handleSetError}
          inputRef={inputRef}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onDeleteTodo={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            currentFilter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} onClose={handleCloseError} />
    </div>
  );
};
