/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { ErrorMassage } from './components/ErrorMassage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { prepareTodos } from './utils/prepareTodos';

const USER_ID = 6372;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMassage, setErrorMassage] = useState(ErrorType.NONE);
  const [isError, setIsError] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisable, setIsDisable] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState<number[]>([]);

  const preparedTodos = useMemo(() => {
    return prepareTodos(filterBy, todos);
  }, [filterBy, todos]);

  const closeError = useCallback(() => {
    setIsError(false);
  }, []);

  const setFilterField = useCallback((field: FilterType) => {
    setFilterBy(field);
  }, []);

  const hasCompletedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const hasActiveTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const hasTodos = todos.length > 0;

  const fetchTodos = async (userId: number) => {
    try {
      const data = await getTodos(userId);

      setTodos(data);
    } catch {
      setErrorMassage(ErrorType.UPLOAD_ERROR);
      setIsError(true);
    }
  };

  const fetchNewTodo = async (title: string) => {
    if (!title) {
      setErrorMassage(ErrorType.TITLE_ERROR);
      setIsError(true);

      return;
    }

    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setIsDisable(true);
      setTempTodo(newTodo);
      await addTodo(newTodo);

      await fetchTodos(USER_ID);
    } catch {
      setErrorMassage(ErrorType.ADD_ERROR);
      setIsError(true);
    } finally {
      setTempTodo(null);
      setIsDisable(false);
    }
  };

  useEffect(() => {
    fetchTodos(USER_ID);
  }, [USER_ID]);

  const fetchDeleteTodo = async (todoId: number) => {
    setActiveTodoId(prev => [
      ...prev,
      todoId,
    ]);
    try {
      await deleteTodo(todoId);
      await fetchTodos(USER_ID);
    } catch {
      setIsError(true);
      setErrorMassage(ErrorType.DELETE_ERROR);
    } finally {
      setActiveTodoId(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleDeleteCompletedTodos = () => {
    return todos.forEach(todo => {
      if (todo.completed) {
        fetchDeleteTodo(todo.id);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={hasTodos}
          hasCompletedTodos={hasCompletedTodos}
          fetchNewTodo={fetchNewTodo}
          isDisable={isDisable}
        />

        <TodoList
          todos={preparedTodos}
          tempTodo={tempTodo}
          fetchDeleteTodo={fetchDeleteTodo}
          activeTodoId={activeTodoId}
        />

        {todos.length > 0 && (
          <Footer
            setFilterField={setFilterField}
            filterBy={filterBy}
            hasCompletedTodos={hasCompletedTodos}
            activeTodo={hasActiveTodos.length}
            handleDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorMassage
        errorMassage={errorMassage}
        closeError={closeError}
        isError={isError}
      />
    </div>
  );
};
