/* eslint-disable prettier/prettier */

import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when the page is loaded
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (tempTodo === null && shouldFocusInput) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      setShouldFocusInput(false);
    }
  }, [tempTodo, shouldFocusInput]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [errorMessage]);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      case Filter.All:
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodosCount = todos.filter(
    todo => todo.completed,
  ).length;

  const handleAddTodo = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      return;
    }

    setErrorMessage('');

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    createTodo(trimmedTitle)
      .then(createdTodo => {
        setTodos(currentTodos => [
          ...currentTodos,
          createdTodo,
        ]);

        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setShouldFocusInput(true);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage('');

    setDeletingIds(currentIds => [
      ...currentIds,
      todoId,
    ]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        setShouldFocusInput(true);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (!completedTodos.length) {
      return;
    }

    setErrorMessage('');

    setDeletingIds(
      completedTodos.map(todo => todo.id),
    );

    Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    ).then(results => {
      const deletedIds: number[] = [];
      let hasError = false;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          deletedIds.push(completedTodos[index].id);
        } else {
          hasError = true;
        }
      });

      if (deletedIds.length) {
        setTodos(currentTodos =>
          currentTodos.filter(
            todo => !deletedIds.includes(todo.id),
          ),
        );
      }

      if (hasError) {
        setErrorMessage('Unable to delete a todo');
      }

      setDeletingIds([]);

      if (deletedIds.length) {
        setShouldFocusInput(true);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const shouldShowTodoList =
    todos.length > 0 || tempTodo !== null;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          onSubmit={handleAddTodo}
          value={title}
          onChange={setTitle}
          disabled={tempTodo !== null}
        />

        {shouldShowTodoList && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletingIds={deletingIds}
            onDelete={handleDeleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          !errorMessage ? 'hidden' : ''
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
