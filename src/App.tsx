import React, { useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { ErrorMessage } from './types/ErrorMessage';
import type { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const ERROR_TIMEOUT = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.all);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LOAD));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(null);
    }, ERROR_TIMEOUT);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const handleAddTodo = async (title: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setTempTodo({ id: 0, title, completed: false, userId: USER_ID });

    try {
      const newTodo = await createTodo({
        title,
        userId: USER_ID,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch {
      setErrorMessage(ErrorMessage.ADD);

      throw new Error('Unable to add a todo');
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DELETE);
      })
      .finally(() => {
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(currentIds => [...currentIds, ...completedIds]);

    const deletedIds: number[] = [];
    let hasError = false;

    await Promise.all(
      completedIds.map(async id => {
        try {
          await deleteTodo(id);
          deletedIds.push(id);
        } catch {
          hasError = true;
        }
      }),
    );

    if (hasError) {
      setErrorMessage(ErrorMessage.DELETE);
    }

    setTodos(currentTodos =>
      currentTodos.filter(todo => !deletedIds.includes(todo.id)),
    );
    setLoadingTodoIds(currentIds =>
      currentIds.filter(id => !completedIds.includes(id)),
    );
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterType.active) {
      return !todo.completed;
    }

    if (filter === FilterType.completed) {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllCompleted}
          isSubmitting={isSubmitting}
          todos={todos}
          onAdd={handleAddTodo}
          onError={setErrorMessage}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onDelete={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
