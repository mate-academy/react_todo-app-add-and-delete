/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  USER_ID as userId,
  getTodos,
  createTodo,
  deleteTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

import { Header } from './components/Header';
import { ErrorInfo } from './components/ErrorInfo';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<ErrorType>(ErrorType.NoError);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    getTodos()
      .then(response => {
        setTodos(response);
      })
      .catch(() => setError(ErrorType.LoadTodos))
      .finally(() => setLoading(false));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  useEffect(() => {
    if (error !== ErrorType.NoError) {
      const timer = setTimeout(() => {
        setError(ErrorType.NoError);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error]);

  const counterNotCompleted = todos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;

  const isAllCompleted = todos.every(todo => todo.completed);
  const isSomeCompleted = todos.some(todo => todo.completed);

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(ErrorType.NoTitle);

      return;
    }

    setLoading(true);
    setLoadingIds(currentIds => [...currentIds, 0]);
    setTodos(currentTodos => [
      ...currentTodos,
      {
        id: 0,
        userId,
        title: title.trim(),
        completed: false,
      },
    ]);

    createTodo({ userId, title: title.trim(), completed: false })
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setError(ErrorType.AddTodo);
      })
      .finally(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== 0));
        setLoading(false);
        setLoadingIds([]);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoading(true);
    setLoadingIds(currentIds => [...currentIds, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(ErrorType.DeleteTodo);
      })
      .finally(() => {
        setLoading(false);
        setLoadingIds([]);
      });
  };

  const handleDeleteAllCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleAddTodo={handleAddTodo}
          isAllCompleted={isAllCompleted}
          loading={loading}
          inputRef={inputRef}
        />

        <TodoList
          todos={filteredTodos}
          loading={loading}
          loadingIds={loadingIds}
          handleDeleteTodo={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            filter={filter}
            onFilter={setFilter}
            isSomeCompleted={isSomeCompleted}
            counterNotCompleted={counterNotCompleted}
            loading={loading}
            handleDeleteAllCompleted={handleDeleteAllCompleted}
          />
        )}
      </div>

      <ErrorInfo errorMessage={error} setError={setError} />
    </div>
  );
};
