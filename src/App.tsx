import React, { useState, useEffect, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Errors, FilterType } from './utils/enums';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Header } from './components/Header';
import { getTodos, removeTodo } from './api/todos';
import { USER_ID } from './utils/UserId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [filter, setFilter] = useState(FilterType.All);

  const [error, setError] = useState<Errors | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      const todoList = await getTodos(USER_ID);

      setTodos(todoList);
    } catch {
      setError(Errors.Url);
    }
  }, []);

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const addTodo = useCallback(async (newTodo: Todo) => {
    setTodos(prevtodos => [...prevtodos, newTodo]);
  }, []);

  const updateTodo = useCallback(async (updatingTodo: Todo) => {
    setTodos(prevTodos => prevTodos.map((todo) => {
      if (todo.id === updatingTodo.id) {
        return updatingTodo;
      }

      return todo;
    }));
  }, []);

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
    switch (filter) {
      case FilterType.Active: return !todo.completed;
      case FilterType.Completed: return todo.completed;
      default: return todo;
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
          onAdd={addTodo}
          setError={setError}
          setTempTodo={setTempTodo}
          loadTodos={loadTodos}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          setTodos={setTodos}
          setError={setError}
          onUpdate={updateTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={visibleTodos}
            filter={filter}
            onChangeSort={setFilter}
            onDelete={deleteTodo}
          />
        )}
      </div>

      {error && (
        <ErrorNotification
          onChangeError={setError}
          error={error}
        />
      )}
    </div>
  );
};
