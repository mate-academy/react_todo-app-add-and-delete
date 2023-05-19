/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Errors, Sort } from './utils/enums';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
// eslint-disable-next-line import/no-cycle
import { Header } from './components/Header';

export const USER_ID = 10284;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [sort, setSort] = useState(Sort.All);

  const [isLoading, setIsLoading] = useState(false);

  const [Error, setError] = useState<Errors | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      const todoList = await getTodos(USER_ID);

      setTodos(todoList);
    } catch {
      setError(Errors.Url);
    }
  }, []);

  if (Error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const deleteTodo = useCallback(async (todoId:number) => {
    setError(null);
    try {
      await removeTodo(todoId);
    } catch {
      setError(Errors.Delete);
    }

    loadTodos();
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (sort) {
      case Sort.Active: return !todo.completed;
      case Sort.Completed: return todo.completed;
      default: return todos;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          onAdd={createTodo}
          setError={setError}
          setTempTodo={setTempTodo}
          setIsLoading={setIsLoading}
          loadTodos={loadTodos}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          setTodos={setTodos}
          setError={setError}
          isLoading={isLoading}
        />

        {todos.length > 0 && (
          <Footer
            todos={visibleTodos}
            filter={sort}
            setSort={setSort}
            onDelete={deleteTodo}
          />
        )}
      </div>

      {Error && (
        <ErrorNotification
          setHasError={setError}
          hasError={Error}
        />
      )}
    </div>
  );
};
