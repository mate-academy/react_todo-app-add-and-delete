/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { client } from './utils/fetchClient';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const errorTimeout = useRef<number | null>(null);

  function hideErrorButton() {
    setError(null);
  }

  function handleNewFilterMode(mode: Filter) {
    setFilter(mode);
  }

  function showError(message: string) {
    if (errorTimeout.current !== null) {
      clearTimeout(errorTimeout.current);
    }

    setError(message);
    errorTimeout.current = window.setTimeout(() => setError(null), 3000);
  }

  const deleteTodo = async (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);

    try {
      await client.delete(`/todos/${id}`);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  async function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
  }

  function handleNewTitle(title: string): Promise<boolean> {
    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsLoading(true);
    setTempTodo(newTodo);

    return client
      .post<Todo>(`/todos`, newTodo)
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response]);
        setTempTodo(null);

        return true;
      })
      .catch(() => {
        showError('Unable to add a todo');
        setTempTodo(null);

        return false;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const activeTodos = todos?.filter(todo => !todo.completed).length;

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

        setTodos(response);
      } catch {
        showError('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleEmptyTitle={showError}
          handleNewTitle={handleNewTitle}
          isLoading={isLoading}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={todos ?? []}
              filter={filter}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              deletingTodoIds={deletingTodoIds}
            />

            <Footer
              activeTodos={activeTodos ?? 0}
              filter={filter}
              handleNewFilterMode={handleNewFilterMode}
              todos={todos}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification hideErrorButton={hideErrorButton} error={error} />
    </div>
  );
};
