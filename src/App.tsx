/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { Footer, Filter } from './Footer';

const FILTERS: Record<Filter, Filter> = {
  all: 'all',
  active: 'active',
  completed: 'completed',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(FILTERS.all);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideError = (): void => {
    setError('');

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  };

  const showError = (message: string): void => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    setError(message);

    errorTimerRef.current = setTimeout(() => {
      setError('');
      errorTimerRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    const loadTodos = async (): Promise<void> => {
      hideError();
      setIsLoading(true);

      try {
        const loadedTodos: Todo[] = await getTodos();

        setTodos(loadedTodos);
      } catch {
        showError(ErrorType.Load);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();

    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      newTodoFieldRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (tempTodo === null && !isLoading) {
      newTodoFieldRef.current?.focus();
    }
  }, [tempTodo, isLoading]);

  useEffect(() => {
    if (deletingTodoIds.length === 0 && !isLoading) {
      newTodoFieldRef.current?.focus();
    }
  }, [deletingTodoIds, isLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos: Todo[] = todos.filter((todo: Todo): boolean => {
    switch (filter) {
      case FILTERS.active:
        return !todo.completed;

      case FILTERS.completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodosCount: number = todos.filter(
    (todo: Todo): boolean => !todo.completed,
  ).length;

  const hasCompletedTodos: boolean = todos.some(
    (todo: Todo): boolean => todo.completed,
  );

  const handleAddTodo = async (): Promise<void> => {
    const trimmedTitle: string = title.trim();

    if (!trimmedTitle) {
      showError(ErrorType.EmptyTitle);

      return;
    }

    hideError();

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    try {
      const createdTodo: Todo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos((currentTodos: Todo[]): Todo[] => [
        ...currentTodos,
        createdTodo,
      ]);

      setTitle('');
    } catch {
      showError(ErrorType.Add);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number): Promise<void> => {
    setDeletingTodoIds((currentIds: number[]): number[] => [
      ...currentIds,
      todoId,
    ]);

    try {
      await deleteTodo(todoId);

      setTodos((currentTodos: Todo[]): Todo[] =>
        currentTodos.filter((todo: Todo): boolean => todo.id !== todoId),
      );
    } catch {
      showError(ErrorType.Delete);
    } finally {
      setDeletingTodoIds((currentIds: number[]): number[] =>
        currentIds.filter((id: number): boolean => id !== todoId),
      );
    }
  };

  const handleClearCompleted = async (): Promise<void> => {
    const completedTodos: Todo[] = todos.filter(
      (todo: Todo): boolean => todo.completed,
    );

    setDeletingTodoIds(completedTodos.map((todo: Todo): number => todo.id));

    const results: PromiseSettledResult<void>[] = await Promise.allSettled(
      completedTodos.map((todo: Todo): Promise<void> => deleteTodo(todo.id)),
    );

    const successfullyDeletedIds: number[] = completedTodos
      .filter(
        (_todo: Todo, index: number): boolean =>
          results[index].status === 'fulfilled',
      )
      .map((todo: Todo): number => todo.id);

    setTodos((currentTodos: Todo[]): Todo[] =>
      currentTodos.filter(
        (todo: Todo): boolean => !successfullyDeletedIds.includes(todo.id),
      ),
    );

    setDeletingTodoIds([]);

    const hasError: boolean = results.some(
      (result: PromiseSettledResult<void>): boolean =>
        result.status === 'rejected',
    );

    if (hasError) {
      showError(ErrorType.Delete);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          isAdding={tempTodo !== null}
          onTitleChange={setTitle}
          onSubmit={handleAddTodo}
          inputRef={newTodoFieldRef}
        />

        {!isLoading && (todos.length > 0 || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletingTodoIds={deletingTodoIds}
            onDelete={handleDeleteTodo}
          />
        )}

        {!isLoading && todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          error ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />

        {error}
      </div>
    </div>
  );
};
