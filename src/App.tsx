import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Todo } from './types/Todo';

import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { UserWarning } from './UserWarning';
import { getActiveTodos } from './utils/getActiveTodos';
import { getCompletedTodos } from './utils/getCompletedTodos';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<ErrorType>(ErrorType.NO_ERROR);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodosId, setActiveTodosId] = useState<number[]>([]);

  const USER_ID = 6381;

  const getAllTodos = async (userId: number) => {
    try {
      const todosFromServer = await getTodos(userId);

      setTodos(todosFromServer);
    } catch {
      setHasError(true);
      setError(ErrorType.UPLOAD_ERROR);
      // eslint-disable-next-line no-console
      console.warn('An occur error while loading todos');
    }
  };

  useEffect(() => {
    getAllTodos(USER_ID);
  }, []);

  const handleAddTodo = async (userId: number, title: string) => {
    if (!title.trim()) {
      setHasError(true);
      setError(ErrorType.EMPTY_ERROR);

      return;
    }

    const newTodo = {
      id: 0,
      userId,
      title,
      completed: false,
    };

    try {
      setIsInputDisabled(true);
      setTempTodo(newTodo);
      await addTodo(newTodo);
      await getAllTodos(USER_ID);
    } catch {
      setHasError(true);
      setError(ErrorType.ADD_ERROR);
      // eslint-disable-next-line no-console
      console.warn('An occur error while adding todo');
    } finally {
      setIsInputDisabled(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setActiveTodosId(prevTodosId => [
      ...prevTodosId,
      todoId,
    ]);

    try {
      await deleteTodo(todoId);
      await getAllTodos(USER_ID);
    } catch {
      setHasError(true);
      setError(ErrorType.DELETE_ERROR);
      // eslint-disable-next-line no-console
      console.warn('An occur error while deleting todo');
    } finally {
      setActiveTodosId(prevTodosId => prevTodosId.filter(id => id !== todoId));
    }
  };

  const deleteCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  const filteredTodos = useMemo(() => getFilteredTodos(todos, filterType),
    [todos, filterType]);

  const activeTodos = useMemo(() => getActiveTodos(todos), [todos]);

  const completedTodos = useMemo(() => getCompletedTodos(todos), [todos]);

  const changeFilterType = useCallback((type: FilterType) => {
    setFilterType(type);
  }, []);

  const handleError = useCallback((status: boolean) => {
    setHasError(status);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={todos.length}
          hasActiveTodos={activeTodos.length}
          userId={USER_ID}
          handleAddTodo={handleAddTodo}
          isInputDisabled={isInputDisabled}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          activeTodosId={activeTodosId}
        />

        {!!todos.length && (
          <Footer
            activeTodos={activeTodos.length}
            hasCompletedTodos={completedTodos.length}
            filterType={filterType}
            changeFilterType={changeFilterType}
            deleteCompleted={deleteCompletedTodos}
          />
        )}
      </div>

      <Notification
        error={error}
        hasError={hasError}
        handleError={handleError}
      />
    </div>
  );
};
