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
  const [error, setError] = useState<ErrorType>(ErrorType.NOERROR);
  const [waitngResponse, setWaitingResponse] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(ErrorType.LOAD);
      setTimeout(() => {
        setError(ErrorType.NOERROR);
      }, 3000);
    }
  };

  const postTodo = useCallback(async (title: string) => {
    try {
      setWaitingResponse(true);
      setTempTodo({
        userId: USER_ID, completed: false, title, id: 0,
      });
      const newTodo = await addTodo(
        { userId: USER_ID, completed: false, title },
      );

      setTodos(currentTodos => [...currentTodos, newTodo]);
    } catch {
      setError(ErrorType.ADD);
      setTimeout(() => {
        setError(ErrorType.NOERROR);
      }, 3000);
    } finally {
      setTempTodo(null);
      setWaitingResponse(false);
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setIsDeleted(true);
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorType.DELETE);
      setTimeout(() => {
        setError(ErrorType.NOERROR);
      }, 3000);
    }
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterType.ALL:
          return todo;

        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return todo;
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
          isDataReciving={waitngResponse}
          activeTodosCount={uncompletedTodosCount}
        />

        <TodoList
          todos={filteredTodos}
          removeTodo={removeTodo}
          tempTodo={tempTodo}
          isDeleted={isDeleted}
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

      <NotificationError error={error} setError={setError} />
    </div>
  );
};
