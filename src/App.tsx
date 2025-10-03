/* eslint-disable @typescript-eslint/indent */

import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  getTodos,
  removeTodo,
  toggleAllTodosStatus,
  toggleTodoStatus,
} from './api/todos';
import { TempTodo, Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { flushSync } from 'react-dom';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState<
    Record<string | number, boolean>
  >({});
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const errorTimerRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isAnyLoading = Object.values(loadingTodos).some(v => v);

  const showError = (message: string) => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    flushSync(() => {
      setError(message);
    });

    errorTimerRef.current = window.setTimeout(() => setError(''), 3000);
  };

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch {
        showError('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    const disabled = isAddingTodo || isAnyLoading;

    if (!disabled && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isAddingTodo, isAnyLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    const newTemp: TempTodo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
      isTemp: true,
    };

    setTempTodo(newTemp);
    setIsAddingTodo(true);

    createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prev => [...prev, { ...newTodo, title: trimmedTitle }]);
        setNewTodoTitle('');
        setError('');
      })
      .catch(() => {
        showError('Unable to add a todo');
        setNewTodoTitle(trimmedTitle);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAddingTodo(false);
      });
  };

  const toggleTodo = (id: number) => {
    setLoadingTodos(prev => ({ ...prev, [id]: true }));
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    toggleTodoStatus(id, !todo.completed)
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
        setError('');
      })
      .catch(() => showError('Unable to update todo'))
      .finally(() => setLoadingTodos(prev => ({ ...prev, [id]: false })));
  };

  const toggleAllTodos = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const ids = todos.map(t => t.id);

    setLoadingTodos(ids.reduce((acc, id) => ({ ...acc, [id]: true }), {}));

    toggleAllTodosStatus(todos, !allCompleted)
      .then(updatedTodos => setTodos(updatedTodos))
      .catch(() => showError('Unable to update todos'))
      .finally(() => setLoadingTodos({}));
  };

  const deleteTodo = (id: number) => {
    setLoadingTodos(prev => ({ ...prev, [id]: true }));

    removeTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => setLoadingTodos(prev => ({ ...prev, [id]: false })));
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (!completedTodos.length) {
      return;
    }

    setLoadingTodos(
      completedTodos.reduce((acc, t) => ({ ...acc, [t.id]: true }), {}),
    );
    Promise.allSettled(completedTodos.map(todo => removeTodo(todo.id)))
      .then(results => {
        const failedIds: number[] = [];

        results.forEach((r, index) => {
          if (r.status === 'rejected') {
            failedIds.push(completedTodos[index].id);
          }
        });

        setTodos(prev =>
          prev.filter(
            todo =>
              !completedTodos.some(
                t => t.id === todo.id && !failedIds.includes(t.id),
              ),
          ),
        );

        if (failedIds.length > 0) {
          showError('Unable to delete a todo');
        }
      })
      .finally(() => setLoadingTodos({}));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          addTodo={addTodo}
          toggleAllTodos={toggleAllTodos}
          todos={todos}
          isAnyLoading={isAnyLoading}
          isAddingTodo={isAddingTodo}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          loadingTodos={loadingTodos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            clearCompleted={clearCompleted}
            isAnyLoading={isAnyLoading}
          />
        )}
      </div>

      <div>
        <ErrorNotification errorMessage={error} setError={setError} />
      </div>
    </div>
  );
};
