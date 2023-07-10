/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { getFilteredTodos } from './heplers/getFilteredTodos';
import { SortType } from './enum/SortType';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';

const USER_ID = 10922;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortBy, setSortBy] = useState(SortType.All);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodos(data));
  }, []);

  useEffect(() => {
    let timerId:NodeJS.Timeout;

    if (error) {
      timerId = setTimeout(() => {
        setError(null);
      }, 2000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  const createTodo = useCallback(async (title: string) => {
    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });

    try {
      const createdTodo = await addTodo(newTodo);

      setTempTodo(null);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setError('Unable to create a todo');
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    setLoadingIds(prevIds => [...prevIds, id]);

    try {
      await deleteTodo(id);
      setTodos(prevTodos => (
        prevTodos.filter(todo => todo.id !== id)));

      setLoadingIds([0]);
    } catch {
      setError('Unable to delete a todo');
    }
  }, []);

  const updateStatus = useCallback(async (id: number, status: boolean) => {
    setLoadingIds(prevIds => [...prevIds, id]);

    try {
      await updateTodo(id, status);
      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== id) {
          return todo;
        }

        return {
          ...todo,
          completed: status,
        };
      }));

      setLoadingIds([0]);
    } catch {
      setError('Unable to update a todo');
    }
  }, []);

  const handleSortType = (type: SortType) => {
    setSortBy(type);
  };

  const handleTitleError = (message: string) => {
    setError(message);
  };

  const handleDeleteAllCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => removeTodo(todo.id));

    Promise.all(deletePromises)
      .then(() => (
        setTodos(prevTodos => (
          prevTodos.filter(todo => !todo.completed)))
      ));
  };

  const filters: string[] = [
    SortType.All,
    SortType.Active,
    SortType.Completed,
  ];

  const visibleTodos = getFilteredTodos(todos, sortBy);

  const amountCompletedTodos = visibleTodos.filter(
    todo => !todo.completed,
  ).length;
  const isVisibleClear = visibleTodos.every(todo => !todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          createTodo={createTodo}
          showError={handleTitleError}
        />

        <TodoList
          tempTodo={tempTodo}
          todos={visibleTodos}
          onCheck={updateStatus}
          onDelete={removeTodo}
          loadingIds={loadingIds}
        />
        <TodoFooter
          count={amountCompletedTodos}
          filters={filters}
          sortBy={sortBy}
          onSortType={handleSortType}
          isVisible={isVisibleClear}
          onDeleteCompleted={handleDeleteAllCompleted}
        />
      </div>

      {error && (
        <div
          className={`notification is-danger is-light
          has-text-weight-normal ${!error ? 'hidden' : ''}`}
        >
          <button
            type="button"
            className="delete"
            onClick={() => setError(null)}
          />
          {error}
        </div>
      )}
    </div>
  );
};
