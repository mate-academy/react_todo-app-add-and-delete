import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as Methods from './api/todos';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';

export enum TodoStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TodoStatus>(TodoStatus.All);
  const [newTodo, setNewTodo] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [pendingTodos, setPendingTodos] = useState<Todo[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        setErrorMessage('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    if (!isInputDisabled) {
      inputRef?.current?.focus();
    }
  }, [isInputDisabled]);

  const filteredTodos = todos.filter(todo => {
    switch (statusFilter) {
      case TodoStatus.Active:
        return !todo.completed;
      case TodoStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.reduce(
    (count, todo) => (!todo.completed && todo.id > 0 ? count + 1 : count),
    0,
  );

  const addTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodo.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    const trimmedTitle = newTodo.trim();
    const tempId = Math.random();
    const tempTodoToAdd: Todo = {
      id: tempId,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setPendingTodos([...pendingTodos, tempTodoToAdd]);
    setLoadingTodoId(tempId);
    setIsInputDisabled(true);

    try {
      const addedTodo = await Methods.addTodo({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(currentTodos => [...currentTodos, addedTodo]);
      setPendingTodos(currentPendingTodos =>
        currentPendingTodos.filter(todo => todo.id !== tempId),
      );
      setNewTodo('');
    } catch {
      setErrorMessage('Unable to add a todo');
      setPendingTodos(currentPendingTodos =>
        currentPendingTodos.filter(todo => todo.id !== tempId),
      );
    } finally {
      setLoadingTodoId(null);
      setIsInputDisabled(false);
      inputRef?.current?.focus();
    }
  };

  const deleteTodo = async (todoId: number) => {
    setLoadingTodoId(todoId);

    try {
      await Methods.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoId(null);
      inputRef?.current?.focus();
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    let errorOccurred = false;

    try {
      await Promise.all(
        completedTodos.map(async todo => {
          try {
            await Methods.deleteTodo(todo.id);

            setTodos(currentTodos =>
              currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
            );
          } catch {
            setErrorMessage('Unable to delete a todo');
            errorOccurred = true;
          }
        }),
      );
    } catch {
      setErrorMessage('Error occurred while clearing completed todos.');
    } finally {
      if (!errorOccurred) {
        setErrorMessage(null);
      }

      inputRef?.current?.focus();
    }
  };

  const hideError = () => setErrorMessage(null);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTitle={newTodo}
          setNewTitle={setNewTodo}
          onSubmit={addTodo}
          isInputDisabled={isInputDisabled}
          inputRef={inputRef}
        />

        <TodoList
          filteredTodos={[...filteredTodos, ...pendingTodos]}
          loadingTodoId={loadingTodoId}
          deleteTodo={deleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredTodos={filteredTodos}
            activeCount={activeCount}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
