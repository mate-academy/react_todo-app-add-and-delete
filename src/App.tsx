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
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      setErrorMessage('');

      try {
        const loadedTodos = await todosApi.getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorMessage(ErrorMessage.Load);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  }, [todos, tempTodo]);

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

  const handleAddTodo = async (title: string) => {
    if (!title) {
      setErrorMessage(ErrorMessage.Title);
      throw new Error();
    }

    setErrorMessage('');
    setIsAdding(true);
    setTempTodo({
      id: 0,
      userId: todosApi.USER_ID,
      title,
      completed: false,
    });

    try {
      const newTodo = await todosApi.addTodo({
        userId: todosApi.USER_ID,
        title,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch {
      setErrorMessage(ErrorMessage.Add);
      throw new Error();
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  };

  const handleTodoStatusChange = async (
    todoId: number,
    currentCompleted: boolean,
  ) => {
    setErrorMessage('');

    try {
      const updatedTodo = await todosApi.updateTodo(todoId, !currentCompleted);

      setTodos(previousTodos =>
        previousTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch {
      setErrorMessage(ErrorMessage.Update);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setErrorMessage('');

    try {
      await todosApi.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.Delete);
    }
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
          onAdd={handleAddTodo}
          disabled={isAdding}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={handleDeleteTodo}
          onStatusChange={handleTodoStatusChange}
          tempTodo={tempTodo}
        />

        {(todos.length > 0 || tempTodo) && (
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
