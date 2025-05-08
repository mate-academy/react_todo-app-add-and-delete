import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Todo } from './types/Todo';
import { TypeFilter } from './types/TypeFilter';
import * as api from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotifications } from './components/ErrorNotifications';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoInput, setNewTodoInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [filter, setFilter] = useState(TypeFilter.All);

  const newInputRef = useRef<HTMLInputElement | null>(null);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const activeCount = activeTodos.length;

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 3000);
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case TypeFilter.Active:
        return activeTodos;

      case TypeFilter.Completed:
        return completedTodos;

      default:
        return todos;
    }
  }, [todos, filter, activeTodos, completedTodos]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosData = await api.getTodos();

        setTodos(todosData);
      } catch {
        showError('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = newTodoInput.trim();

    if (!title) {
      showError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTodo = {
      id: 0,
      title,
      userId: api.USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const createdTodo = await api.createTodo(newTodo);

      setTodos(prev => [...prev, createdTodo]);
      setNewTodoInput('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const deleteTodos = async (ids: number[]) => {
    if (!ids.length) {
      return;
    }

    setLoadingIds(ids);

    await Promise.all(
      ids.map(async id => {
        try {
          await api.deleteTodo(id);
          setTodos(prev => prev.filter(todo => todo.id !== id));
        } catch {
          showError('Unable to delete a todo');
        }
      }),
    );

    setLoadingIds([]);
  };

  const clearCompletedTodos = () => {
    const completedIds = completedTodos.map(todo => todo.id);

    deleteTodos(completedIds);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          newTodoInput={newTodoInput}
          setNewTodoInput={setNewTodoInput}
          addTodo={addTodo}
          isLoading={isLoading}
          newInputRef={newInputRef}
          loadingIds={loadingIds}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodos={deleteTodos}
          tempTodo={tempTodo}
          isLoading={isLoading}
          loadingIds={loadingIds}
        />

        {todos.length > 0 && (
          <TodoFooter
            filterBy={filter}
            setFilterBy={setFilter}
            activeCount={activeCount}
            hasCompleted={completedTodos.length > 0}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotifications errorMessage={error} setErrorMessage={setError} />
    </div>
  );
};
