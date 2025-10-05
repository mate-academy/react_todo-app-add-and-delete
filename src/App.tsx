import React, { useEffect, useRef, useState } from 'react';
import * as todoManager from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FILTER, FilterStatus } from './types/Filter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { ErrorMessage } from './types/ErrorMassage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterStatus>(FILTER.ALL);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [error, setError] = useState<ErrorMessage | ''>('');
  const errorTimerId = useRef(0);

  const mainInput = useRef<HTMLInputElement>(null);

  const showError = (errorMsg: ErrorMessage) => {
    if (errorTimerId.current) {
      window.clearTimeout(errorTimerId.current);
    }

    setError(errorMsg);
    errorTimerId.current = window.setTimeout(() => setError(''), 3000);
  };

  const hideError = () => {
    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
      errorTimerId.current = 0;
    }

    setError('');
  };

  const handleFilterChange = (filterParam: FilterStatus) => {
    setFilterBy(filterParam);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await todoManager.getTodos();

        setTodos(data);
      } catch {
        showError(ErrorMessage.UnableToLoad);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (title: string) => {
    hideError();

    const todo: Todo = {
      id: 0,
      userId: todoManager.USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(todo);

    try {
      const newTodo = await todoManager.addTodo(title);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      mainInput.current?.focus();

      return true;
    } catch {
      showError(ErrorMessage.UnableToAdd);

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setDeletingIds(currentIds => new Set([...currentIds, todoId]));
    try {
      await todoManager.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      mainInput.current?.focus();
    } catch {
      showError(ErrorMessage.UnableToDelete);
    } finally {
      setDeletingIds(currentIds => {
        const newIds = new Set(currentIds);

        newIds.delete(todoId);

        return newIds;
      });
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
    } catch {
      showError(ErrorMessage.UnableToDelete);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterBy) {
      case FILTER.COMPLETED:
        return todo.completed;
      case FILTER.ACTIVE:
        return !todo.completed;
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          inputRef={mainInput}
          onSubmit={addTodo}
          onError={(msg: string) => showError(msg as ErrorMessage)}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodo}
          deletingIds={deletingIds}
        />

        {tempTodo && <TodoItem todo={tempTodo} isTempTodo />}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            onFilterChange={handleFilterChange}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMsg={error} onClose={hideError} />
    </div>
  );
};
