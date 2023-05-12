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
      await deleteTodo(todoId);
      await getTodosFromServer();
    } catch {
      setError(ErrorType.DELETE);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filterType]);

  const uncompletedTodosCount = useMemo(() => (
    filteredTodos.filter(todo => !todo.completed).length
  ), [filteredTodos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

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
          activeTodosCount={uncompletedTodosCount}
        />

        <TodoList
          todos={filteredTodos}
          removeTodo={removeTodo}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <FilterTodos
            uncompletedCount={uncompletedTodosCount}
            completedTodos={completedTodos}
            filterType={filterType}
            onFilter={setFilterType}
            removeTodo={removeTodo}
          />
        )}
      </div>

      {error && (
        <NotificationError error={error} setError={setError} />
      )}
    </div>
  );
};
