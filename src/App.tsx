/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

import { Todo } from './types/Todo';
import { FILTER, Filter } from './types/Filter';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(FILTER.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const newTodoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      newTodoInput.current?.focus();
    }
  }, [isAdding]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAdding) {
      return;
    }

    const title = newTodoTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const createdTodo = await createTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, createdTodo]);

      setNewTodoTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (id === 0 || deletingIds.includes(id)) {
      return;
    }

    setErrorMessage('');

    setDeletingIds(currentIds => [...currentIds, id]);

    try {
      await deleteTodo(id);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletingIds(currentIds =>
        currentIds.filter(currentId => currentId !== id),
      );

      newTodoInput.current?.focus();
    }
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed && !deletingIds.includes(todo.id))
      .forEach(todo => {
        void handleDelete(todo.id);
      });
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

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

    const timeoutId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FILTER.ACTIVE:
        return !todo.completed;

      case FILTER.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handleSubmit={handleSubmit}
          isAdding={isAdding}
          allTodosCompleted={allTodosCompleted}
          newTodoInput={newTodoInput}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletingIds={deletingIds}
            onDelete={handleDelete}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
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
