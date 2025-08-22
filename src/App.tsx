import React, { useEffect, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FILTER, Filter } from './types/Filter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filter>(FILTER.ALL);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [error, setError] = useState('');
  const errorTimerId = useRef(0);

  const mainInput = useRef<HTMLInputElement>(null);

  const showError = (errorMsg: string) => {
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

  const handleFilterChange = (filterParam: Filter) => {
    setFilterBy(filterParam);
  };

  useEffect(() => {
    setError('');
    const fetchTodos = async () => {
      try {
        const data = await todoService.getTodos();

        setTodos(data);
      } catch {
        showError('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (title: string) => {
    hideError();

    const todo: Todo = {
      id: 0,
      userId: todoService.USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(todo);

    try {
      const newTodo = await todoService.addTodo(title);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      mainInput.current?.focus();

      return true;
    } catch {
      showError('Unable to add a todo');

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setDeletingIds(currentIds => new Set(currentIds).add(todoId));
    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      mainInput.current?.focus();
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setDeletingIds(currentIds => {
        const next = new Set(currentIds);

        next.delete(todoId);

        return next;
      });
    }
  };

  const clearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => deleteTodo(todo.id));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterBy) {
      case FILTER.ALL:
        return true;
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
          onError={showError}
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
