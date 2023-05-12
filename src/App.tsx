import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Todo } from './types/Todo';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { FilterTodos } from './components/FilterTodos';
import { Form } from './components/Form';
import { NotificationError } from './components/NotificationError';

import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

const USER_ID = 10210;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [error, setError] = useState<ErrorType | null>(null);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isProcessingId, setIsProcessingId] = useState<number[]>([]);

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(ErrorType.LOAD);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const postTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        userId: USER_ID, completed: false, title,
      };
      const temp = { ...newTodo, id: 0 };

      setLoading(true);
      setTempTodo(temp);
      await addTodo(newTodo);
      await getTodosFromServer();
    } catch {
      setError(ErrorType.ADD);
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setTempTodo(null);
      setLoading(false);
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setIsProcessingId(currentIds => currentIds.concat(todoId));
      await deleteTodo(todoId);
      await getTodosFromServer();
    } catch {
      setError(ErrorType.DELETE);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, []);

  const clearCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filterType]);

  const isCompletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const activeTodosCount = useMemo(() => (
    visibleTodos.filter(todo => !todo.completed).length
  ), [visibleTodos]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Form
          post={postTodo}
          setError={setError}
          loading={loading}
          activeTodosCount={activeTodosCount}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          isProcessingId={isProcessingId}
          removeTodo={removeTodo}
        />

        {!!todos.length && (
          <FilterTodos
            activeTodosCount={activeTodosCount}
            isCompletedTodos={isCompletedTodos}
            filterType={filterType}
            onFilter={setFilterType}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      {error && (
        <NotificationError error={error} setError={setError} />
      )}
    </div>
  );
};
