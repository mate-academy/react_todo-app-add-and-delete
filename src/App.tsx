/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const isAdding = tempTodo !== null;

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);

      case 'completed':
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed);

  const hasTodos = todos.length > 0;
  const hasCompletedTodos = completedTodos.length > 0;

  const areAllTodosCompleted = hasTodos && todos.every(todo => todo.completed);

  const isClearingCompleted = completedTodos.some(todo =>
    processingTodoIds.includes(todo.id),
  );

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleErrorClose = () => {
    setErrorMessage('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    setErrorMessage('');

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);
      focusInput();

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    try {
      const createdTodo = await createTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, createdTodo]);

      setTitle('');
    } catch {
      setErrorMessage(ErrorMessage.Add);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    setErrorMessage('');

    setProcessingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.Delete);
    } finally {
      setProcessingTodoIds(currentIds =>
        currentIds.filter(id => id !== todoId),
      );

      focusInput();
    }
  };

  const handleClearCompleted = async () => {
    const todoIds = completedTodos.map(todo => todo.id);

    if (todoIds.length === 0) {
      return;
    }

    setErrorMessage('');

    setProcessingTodoIds(currentIds =>
      Array.from(new Set([...currentIds, ...todoIds])),
    );

    const results = await Promise.allSettled(
      todoIds.map(todoId => deleteTodo(todoId)),
    );

    const deletedTodoIds = new Set<number>();

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        deletedTodoIds.add(todoIds[index]);
      }
    });

    setTodos(currentTodos =>
      currentTodos.filter(todo => !deletedTodoIds.has(todo.id)),
    );

    const hasDeletionError = results.some(
      result => result.status === 'rejected',
    );

    if (hasDeletionError) {
      setErrorMessage(ErrorMessage.Delete);
    }

    setProcessingTodoIds(currentIds =>
      currentIds.filter(id => !todoIds.includes(id)),
    );

    focusInput();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              type="button"
              className={[
                'todoapp__toggle-all',
                areAllTodosCompleted ? 'active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              disabled={isAdding}
              onChange={event => {
                setTitle(event.target.value);
              }}
              autoFocus
            />
          </form>
        </header>

        {(hasTodos || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingTodoIds={processingTodoIds}
            onDelete={handleDelete}
          />
        )}

        {hasTodos && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            isClearingCompleted={isClearingCompleted}
            selectedFilter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} onClose={handleErrorClose} />
    </div>
  );
};
