import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosApi from './api/todos';
import type { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setErrorMessage('');

    todosApi
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  }, [todos]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasCompletedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length > 0,
    [todos],
  );

  const isEveryTodoCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );

  const filteredTodos = useMemo(() => {
    if (filter === Filter.Active) {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === Filter.Completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [todos, filter]);

  const handleTodoStatusChange = (
    todoId: number,
    currentCompleted: boolean,
  ) => {
    setErrorMessage('');

    todosApi
      .updateTodo(todoId, !currentCompleted)
      .then(updatedTodo => {
        setTodos(previousTodos =>
          previousTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(() => setErrorMessage(ErrorMessage.Update));
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage('');

    todosApi
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      });
  };

  if (!todosApi.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoInputRef={todoInput}
          isEveryTodoCompleted={isEveryTodoCompleted}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          onStatusChange={handleTodoStatusChange}
        />

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            onFilterChange={setFilter}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
