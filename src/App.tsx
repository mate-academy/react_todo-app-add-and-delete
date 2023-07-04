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
import { TodoMain } from './components/TodoMain';
import { TodoFooter } from './components/TodoFooter';

const USER_ID = 10922;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortBy, setSortBy] = useState(SortType.All);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodos(data));
  }, []);

  const createTodo = useCallback(async (title: string) => {
    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    const createdTodo = await addTodo(newTodo);

    setTodos(prevTodos => [...prevTodos, createdTodo]);
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    }
  }, []);

  const updateStatus = useCallback(async (id: number, status: boolean) => {
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
    } catch {
      setError('Unable to update a todo');
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSortType = (type: SortType) => {
    setSortBy(type);
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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          createTodo={createTodo}
        />

        <TodoMain
          todos={visibleTodos}
          onCheck={updateStatus}
          onDelete={removeTodo}
        />
        <TodoFooter
          count={amountCompletedTodos}
          filters={filters}
          sortBy={sortBy}
          onSortType={handleSortType}
          isVisible={isVisibleClear}
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
